const low = {
  $gte: 0,
  $lte: 35,
};
const medium = {
  $gt: 35,
  $lte: 60,
};
const high = {
  $gt: 60,
  $lte: 100,
};
// Hydration, oilness, and elasticity ranges
const ranges = {
  low: { $gte: 0, $lte: 35 },
  medium: { $gt: 35, $lte: 60 },
  high: { $gt: 60, $lte: 100 },
};
module.exports = { ranges };
