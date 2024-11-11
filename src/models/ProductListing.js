const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productImage: {
        type: String,
        required: true
    },
    featureImages: {
        type: [String],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableAmount: {
        type: Number,
        required: true
    },
    amazonUrl: {
        type: String,
        required: true
    },
    discountPrice: {
        type: Number
    },
    hydration: {
        type: String,
        enum: ['low', 'medium', 'high','any'],
        required: true
    },
    oil: {
        type: String,
        enum: ['low', 'medium', 'high','any'],
        required: true
    },
    elasticity: {
        type: String,
        enum: ['low', 'medium', 'high','any'],
        required: true
    },
    detail: {
        type: String,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
