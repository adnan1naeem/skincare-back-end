const ProductValueRange = require("../../models/ProductValueRange");
const { getRanges } = require("../constants");

function isFirstDateLarger(firstDate, secondDate) {
  // Convert the date strings to Date objects if they are not already
  const date1 = new Date(firstDate);
  const date2 = new Date(secondDate);

  // Compare the two dates
  return date1 > date2;
}
// Function to determine the skin type based on the value
async function getSkinType(value) {
  const ranges = await getRanges(ProductValueRange);
  if (value >= ranges.low.$gte && value <= ranges.low.$lte) {
    return "low";
  } else if (value > ranges.medium.$gt && value <= ranges.medium.$lte) {
    return "medium";
  } else if (value > ranges.high.$gt && value <= ranges.high.$lte) {
    return "high";
  }
  return null;
}
module.exports = { isFirstDateLarger, getSkinType };
