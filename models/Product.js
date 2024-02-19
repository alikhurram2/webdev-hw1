const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productID: String,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' }
});

const Product = mongoose.model('Products', ProductSchema);

module.exports = Product;
