// const mongoose = require('mongoose');

// const productSchema = mongoose.Schema({
//    _id: mongoose.Schema.Types.ObjectId,
//    name: { type: String, required: true },
//    price: { type: Number, required: true },
//    productImage: { type: String, required: true }
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
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

module.exports = mongoose.model("product", productSchema);