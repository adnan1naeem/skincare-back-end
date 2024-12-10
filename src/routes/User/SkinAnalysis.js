const router = require('express').Router();
const Description = require('../../models/Description');
const Skinanalysis = require('../../models/SkinAnalysis');
const SkinAnalysisDescription = require('../../models/SkinAnalysisDescription')
const moment = require('moment-timezone');
const ProductValueRange = require('../../models/ProductValueRange');
const { getRanges } = require('../../utilis/constants');

// const getLevel = async (value) => {
//   const levelRanges = await ProductValueRange.find();

//   console.log(levelRanges, typeof value);
  

//   // Find the range where the value is within the min and max value
//   const range = levelRanges.find(r => value >= parseInt(r.minValue) && value <= parseInt(r.maxValue));

//   // Return the corresponding level or null if no match is found
//   return range ? range.level : null;
// };

// const getLevel = async (value) => {
//   const ranges = await getRanges(ProductValueRange);
//   if (value >= ranges.low.$gte && value <= ranges.low.$lte) {
//     return 'low';
//   } else if (value >= ranges.medium.$gt && value <= ranges.medium.$lte) {
//     return 'medium';
//   } else if (value >= ranges.high.$gt && value <= ranges.high.$lte) {
//     return 'high';
//   }
//   return 'low';
// };

// const getLevel = (value) => {
//   if (value <= 35) return 'low';
//   if (value > 35 && value < 41) return 'medium';
//   if (value >= 41) return 'high';
// };

const getLevel = async (value) => {
  // Fetch the range data from the database
  const productValueRange = await ProductValueRange.findOne(); // Assuming you only have one range in the DB
  
  if (!productValueRange) {
    throw new Error("Product value range not found.");
  }

  // console.log(productValueRange);

  // Check which range the value falls into
  if (value >= parseInt(productValueRange.low.min) && value <= parseInt(productValueRange.low.max)) {
    return 'low';
  }
  if (value >= parseInt(productValueRange.medium.min) && value <= parseInt(productValueRange.medium.max)) {
    return 'medium';
  }
  if (value >= parseInt(productValueRange.high.min) && value <= parseInt(productValueRange.high.max)) {
    return 'high';
  }

  return null;
};


router.post('/', async (req, res) => {
  const { hydration, oilness, elastcity, skinAge } = req.body;
  const timeZone = req.headers['timezone'];
  console.log("timeZone"+timeZone)
  try {
    const user = req.user;
    if (!user._id) {
      return res.status(400).json({ message: 'userId is required' });
    }
    // const levels = {
    //   low: (value) => value < 35,
    //   medium: (value) => value >= 35 && value <= 60,
    //   high: (value) => value > 60,
    // };

    const results = await Promise.all([
      SkinAnalysisDescription.findOne({ parameter: 'oilness', level: await getLevel(oilness) }),
      SkinAnalysisDescription.findOne({ parameter: 'elasticity', level: await getLevel(elastcity) }),
      SkinAnalysisDescription.findOne({ parameter: 'hydration', level: await getLevel(hydration) })
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
    if (skinAnalyses.length === 0) {
      return res.status(200).json([]);
    }

    const analysesWithDescriptions = await Promise.all(skinAnalyses.map(async (analysis) => {
      // Await the resolution of getLevel for each value
      const oilnessLevel = await getLevel(analysis.oilness); // Awaiting getLevel
      const elasticityLevel = await getLevel(analysis.elastcity); // Awaiting getLevel
      const hydrationLevel = await getLevel(analysis.hydration); // Awaiting getLevel
    
      const results = await Promise.all([
        SkinAnalysisDescription.findOne({ parameter: 'oilness', level: oilnessLevel }),
        SkinAnalysisDescription.findOne({ parameter: 'elasticity', level: elasticityLevel }),
        SkinAnalysisDescription.findOne({ parameter: 'hydration', level: hydrationLevel })
      ]);
      
      const mainDescription = await getDescription(oilnessLevel, elasticityLevel, hydrationLevel);
      
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
router.get('/skinanalysisStat', async (req, res) => {
  try {
    const user = req.user
    if (!user._id) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const skinAnalyses = await Skinanalysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)

    if (skinAnalyses.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(skinAnalyses);
  } catch (error) {
    console.error('Error fetching skin analyses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
