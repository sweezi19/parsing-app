const parser = require('./index');
const express = require('express');
const nodemon = require('nodemon');
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
   title: String,
   sku: String,
   brand: String,
   price: String,
   link: String,
   image: String,
   short_description: String,
   categories: String,
   tags: String,
   description: String,
   specifications: String
});

const app = express();

app.set('views', './views')
app.set('view engine', 'pug')

app.get("/", (req, res) => {
   res.send('Hello wolds');
});

app.post('/parse', (req, res) => {
   parser.startApp()
   res.send('The startApp function is running!');

   // res.send(`Parser Site: ${parser.startApp()}`);
   // res.send(`Parser Page: ${parser.getProductUrl()}`);
});

app.get('/getData', (req, res) => {
   parser.Product.find((err, products) => {
      if (err) {
         res.send(err);
      } else {
         res.render('products', { products: products });
      }
   });
});


// app.get('/getData', (req, res) => {
//    parser.Product.find((err, products) => {
//       if (err) {
//          res.send(err);
//       } else {
//          res.json(products);
//       }
//    });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
})
