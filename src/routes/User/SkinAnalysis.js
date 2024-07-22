const router = require('express').Router();
const Skinanalysis = require('../../models/SkinAnalysis');
const SkinAnalysisDescription =require('../../models/SkinAnalysisDescription')

router.post('/', async (req, res) => {
  const { hydration, oilness, elastcity, skinAge } = req.body;
  try {
const user = req.user
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

    if (results.every(result => result)) {
      const skinAnalysis = new Skinanalysis({ hydration, oilness, elastcity, skinAge,userId:user._id });
      await skinAnalysis.save();
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
router.get('/skinanalysisbydate', async (req, res) => {
  try {

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Calculate the date two days ago from today
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const skinAnalyses = await Skinanalysis.find({
      createdAt: { $gte: twoDaysAgo, $lte: today }
    });

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
        }
      };
    }));

    return res.status(200).json(analysesWithDescriptions);
  } catch (error) {
    console.error('Error fetching skin analyses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
