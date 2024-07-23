const { Types } = require("mongoose");
const Product = require("../../models/ProductListing");
const SkinAnalysis = require("../../models/SkinAnalysis");
const { getSkinType } = require("../../utilis/helpers/helper");
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      message: "Products fetched",
      products,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({
      message: "Product fetched",
      product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getRelevant = async (req, res, next) => {
  try {
    const userSkinAnalysis = await SkinAnalysis.findOne({
      userId: new Types.ObjectId(req.user._id),
    });

    // Determine user's skin type based on skin analysis
    const userHydrationType = await getSkinType(userSkinAnalysis.hydration);
    const userOilType = await getSkinType(userSkinAnalysis.oilness);
    const userElasticityType = await getSkinType(userSkinAnalysis.elastcity);
    const products = await Product.find({
      hydration: userHydrationType,
      oil: userOilType,
      elasticity: userElasticityType,
    });
    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProducts, getProductById, getRelevant };