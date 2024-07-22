const {
  getAllProducts,
  getRelevant,
  getProductById,
} = require("../../Controllers/Products/products.controller");

const router = require("express").Router();

router.get("/", getAllProducts);
router.get("/single/:id", getProductById);
router.get("/relevant", getRelevant);
module.exports = router;
