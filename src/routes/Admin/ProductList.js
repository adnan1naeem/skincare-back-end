const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../../models/ProductListing'); // Adjust path as per your project structure

const storage = multer.diskStorage({
  destination: './uploads/', // Specify the directory to save the uploaded files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
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
      detail
    } = req.body;
   // const productImage = req.file ? req.file.path : null;
    console.log(req.body)
    const newProduct = new Product({
      productImage: req.body.productImage,
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
      detail
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.get('/get', upload.single('file'), async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      message: "Products fetched",
      products,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/update/:id', upload.single('file'), async (req, res) => {
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
      detail
    } = req.body;

    const productImage = req.file ? req.file.path : null;
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          productImage: productImage || req.body.productImage,
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
          detail
        }
      },
      { new: true, returnOriginal: false }
    );

    if (!updatedProduct) {
      console.log('results :', updatedProduct)
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
