const router = require('express').Router();
const Description = require('../../models/Description');
const Skinanalysis = require('../../models/SkinAnalysis');
const SkinAnalysisDescription = require('../../models/SkinAnalysisDescription')
const moment = require('moment-timezone');
router.post('/', async (req, res) => {
  const { hydration, oilness, elastcity, skinAge } = req.body;
  const timeZone = req.headers['timezone'];
  console.log("timeZone"+timeZone)
  try {
    const user = req.user;
    if (!user._id) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const levels = {
      low: (value) => value < 35,
      medium: (value) => value >= 35 && value <= 60,
      high: (value) => value > 60,
    };

    const getLevel = (value) => {
      if (levels.low(value)) return 'low';
      if (levels.medium(value)) return 'medium';
      if (levels.high(value)) return 'high';
    };

    const results = await Promise.all([
      SkinAnalysisDescription.findOne({ parameter: 'oilness', level: getLevel(oilness) }),
      SkinAnalysisDescription.findOne({ parameter: 'elasticity', level: getLevel(elastcity) }),
      SkinAnalysisDescription.findOne({ parameter: 'hydration', level: getLevel(hydration) })
    ]);
    const today = moment.tz(timeZone).startOf('day').toDate();
    const endOfDay = moment.tz(timeZone).endOf('day').toDate();
    const latest = await Skinanalysis.findOneAndUpdate(
      {
        userId: user._id,
        createdAt: { $gte: today, $lt: endOfDay }
      }, {
      $set: {
        hydration,
        oilness,
        elastcity,
        skinAge
      }
    }, {
      upsert: true
    })
    if (results.every(result => result)) {
      return res.status(201).json({
        message: 'Skin analysis data saved successfully',
        descriptions: results
      });
    } else {
      return res.status(404).json({ message: 'One or more skin analysis descriptions not found' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
const getLevel = (value) => {
  if (value <= 35) return 'low';
  if (value > 35 && value < 41) return 'medium';
  if (value >= 41) return 'high';
};

async function getDescription(oilnessLevel, elasticityLevel, hydrationLevel) {
  return await Description.findOne({
    oilness: oilnessLevel,
    elasticity: elasticityLevel,
    hydration: hydrationLevel,
  });
}
router.get('/skinanalysisbydate', async (req, res) => {
  try {
    const user = req.user
    if (!user._id) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const skinAnalyses = await Skinanalysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    if (skinAnalyses.length === 0) {
      return res.status(200).json([]);
    }

    const analysesWithDescriptions = await Promise.all(skinAnalyses.map(async (analysis) => {
      const results = await Promise.all([
        SkinAnalysisDescription.findOne({ parameter: 'oilness', level: getLevel(analysis.oilness) }),
        SkinAnalysisDescription.findOne({ parameter: 'elasticity', level: getLevel(analysis.elastcity) }),
        SkinAnalysisDescription.findOne({ parameter: 'hydration', level: getLevel(analysis.hydration) })
      ]);
      const  mainDescription=await getDescription(getLevel(analysis.oilness), getLevel(analysis.elastcity), getLevel(analysis.hydration))
      return {
        ...analysis.toObject(),
        descriptions: {
          oilness: results[0],
          elasticity: results[1],
          hydration: results[2]
        },
        mainDescription: mainDescription?.description
      };
    }));

    return res.status(200).json(analysesWithDescriptions);
  } catch (error) {
    console.error('Error fetching skin analyses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
