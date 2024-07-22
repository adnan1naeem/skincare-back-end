const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../../models/ProductListing'); // Adjust path as per your project structure

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/', // Specify the directory to save the uploaded files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload variable with multer settings
const upload = multer({ storage: storage });

// POST /api/products - Create a new product
router.post('/', upload.single('productImage'), async (req, res) => {
  try {
    const {
      featureImages,
      title,
      description,
      price,
      amazonUrl,
      discountPrice,
      hydration,
      oil,
      elasticity,
      availableAmount,
    } = req.body;

    const productImage = req.file ? req.file.path : null;

    const newProduct = new Product({
      productImage,
      featureImages,
      title,
      description,
      price,
      amazonUrl,
      discountPrice,
      hydration,
      oil,
      elasticity,
      availableAmount,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;
