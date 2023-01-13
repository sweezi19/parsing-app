const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
   title: String,
   sku: String,
   brand: String,
   price: Number,
   link: String,
   image: String,
   short_description: String,
   categories: String,
   tags: String,
   description: String,
   specifications: String
});

module.exports = mongoose.model("user", productSchema);