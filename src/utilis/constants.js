// Hydration, oilness, and elasticity ranges
const getRanges = async (model) => {
  const value = await model.findOne({});
  return {
    low: { $gte: value.low.min, $lte: value.low.max },
    medium: { $gt: value.medium.min, $lte: value.medium.max },
    high: { $gt: value.high.min, $lte: value.high.max },
  };
};
module.exports = { getRanges };
