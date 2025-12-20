const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  platform: String,
  price: Number,
  rating: Number,
  reviewCount: Number,
  productUrl: String,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
