const router = require('express').Router();
const Skinanalysis = require('../../models/SkinAnalysis');
const SkinAnalysisDescription = require('../../models/SkinAnalysisDescription')

router.post('/', async (req, res) => {
  const { hydration, oilness, elastcity, skinAge } = req.body;

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const latest = await Skinanalysis.findOneAndUpdate(
      {
        userId: user._id,
        createdAt: { $gte: today }
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
  if (value < 35) return 'low';
  if (value >= 35 && value <= 60) return 'medium';
  if (value > 60) return 'high';
};
const descriptionsArray = [
  { oilness: 'high', elasticity: 'high', hydration: 'high', description: 'Description for High Oilness, High Elasticity, High Hydration' },
  { oilness: 'high', elasticity: 'high', hydration: 'medium', description: 'Description for High Oilness, High Elasticity, medium Hydration' },
  { oilness: 'high', elasticity: 'high', hydration: 'low', description: 'Description for High Oilness, High Elasticity, Low Hydration' },
  { oilness: 'high', elasticity: 'medium', hydration: 'high', description: 'Description for High Oilness, medium Elasticity, High Hydration' },
  { oilness: 'high', elasticity: 'medium', hydration: 'medium', description: 'Description for High Oilness, medium Elasticity, medium Hydration' },
  { oilness: 'high', elasticity: 'medium', hydration: 'low', description: 'Description for High Oilness, medium Elasticity, Low Hydration' },
  { oilness: 'high', elasticity: 'low', hydration: 'high', description: 'Description for High Oilness, Low Elasticity, High Hydration' },
  { oilness: 'high', elasticity: 'low', hydration: 'medium', description: 'Description for High Oilness, Low Elasticity, medium Hydration' },
  { oilness: 'high', elasticity: 'low', hydration: 'low', description: 'Description for High Oilness, Low Elasticity, Low Hydration' },
  { oilness: 'medium', elasticity: 'high', hydration: 'high', description: 'Description for medium Oilness, High Elasticity, High Hydration' },
  { oilness: 'medium', elasticity: 'high', hydration: 'medium', description: 'Description for medium Oilness, High Elasticity, medium Hydration' },
  { oilness: 'medium', elasticity: 'high', hydration: 'low', description: 'Description for medium Oilness, High Elasticity, Low Hydration' },
  { oilness: 'medium', elasticity: 'medium', hydration: 'high', description: 'Description for medium Oilness, medium Elasticity, High Hydration' },
  { oilness: 'medium', elasticity: 'medium', hydration: 'medium', description: 'Description for medium Oilness, medium Elasticity, medium Hydration' },
  { oilness: 'medium', elasticity: 'medium', hydration: 'low', description: 'Description for medium Oilness, medium Elasticity, Low Hydration' },
  { oilness: 'medium', elasticity: 'low', hydration: 'high', description: 'Description for medium Oilness, Low Elasticity, High Hydration' },
  { oilness: 'medium', elasticity: 'low', hydration: 'medium', description: 'Description for medium Oilness, Low Elasticity, medium Hydration' },
  { oilness: 'medium', elasticity: 'low', hydration: 'low', description: 'Description for medium Oilness, Low Elasticity, Low Hydration' },
  { oilness: 'low', elasticity: 'high', hydration: 'high', description: 'Description for Low Oilness, High Elasticity, High Hydration' },
  { oilness: 'low', elasticity: 'high', hydration: 'medium', description: 'Description for Low Oilness, High Elasticity, medium Hydration' },
  { oilness: 'low', elasticity: 'high', hydration: 'low', description: 'Description for Low Oilness, High Elasticity, Low Hydration' },
  { oilness: 'low', elasticity: 'medium', hydration: 'high', description: 'Description for Low Oilness, medium Elasticity, High Hydration' },
  { oilness: 'low', elasticity: 'medium', hydration: 'medium', description: 'Description for Low Oilness, medium Elasticity, medium Hydration' },
  { oilness: 'low', elasticity: 'medium', hydration: 'low', description: 'Description for Low Oilness, medium Elasticity, Low Hydration' },
  { oilness: 'low', elasticity: 'low', hydration: 'high', description: 'Description for Low Oilness, Low Elasticity, High Hydration' },
  { oilness: 'low', elasticity: 'low', hydration: 'medium', description: 'Description for Low Oilness, Low Elasticity, medium Hydration' },
  { oilness: 'low', elasticity: 'low', hydration: 'low', description: 'Description for Low Oilness, Low Elasticity, Low Hydration' }
];
const getDescription = (oilness, elasticity, hydration) => {
  const match = descriptionsArray.find(
    (desc) => desc.oilness == oilness && desc.elasticity == elasticity && desc.hydration == hydration
  );
  return match ? match.description : 'No matching description found';
};
router.get('/skinanalysisbydate', async (req, res) => {
  try {
    const user = req.user
    if (!user._id) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const skinAnalyses = await Skinanalysis.find({
      userId: user._id,
      createdAt: { $gte: twoDaysAgo, $lte: today }
    });

    if (skinAnalyses.length === 0) {
      return res.status(200).json([]);
    }

    const analysesWithDescriptions = await Promise.all(skinAnalyses.map(async (analysis) => {
      const results = await Promise.all([
        SkinAnalysisDescription.findOne({ parameter: 'oilness', level: getLevel(analysis.oilness) }),
        SkinAnalysisDescription.findOne({ parameter: 'elasticity', level: getLevel(analysis.elastcity) }),
        SkinAnalysisDescription.findOne({ parameter: 'hydration', level: getLevel(analysis.hydration) })
      ]);

      return {
        ...analysis.toObject(),
        descriptions: {
          oilness: results[0],
          elasticity: results[1],
          hydration: results[2]
        },
        mainDescription: getDescription(getLevel(analysis.oilness), getLevel(analysis.elastcity), getLevel(analysis.hydration))
      };
    }));

    return res.status(200).json(analysesWithDescriptions);
  } catch (error) {
    console.error('Error fetching skin analyses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
