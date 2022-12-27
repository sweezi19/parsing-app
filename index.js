const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const tress = require('tress');
const nodemon = require('nodemon');
const fs = require('fs');
const mongoose = require('mongoose')
// const MongoClient = require("mongodb").MongoClient;


mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true});


let browser = null;
// let products = [];

async function initBrowser() {
   browser = await puppeteer.launch({
   // headless: false
   });
}

async function startApp() {
   fs.truncate('products.jsonl', 0, (err) => {
      if (err) {
        console.error(err);
      }
    });

   await initBrowser();

   for (let i = 1; i <= 2019; i++) {
      getProductUrl.push(`https://control-products.com/shop-products/page/${i}`);
   }

}

const getProductUrl = tress((url, done) => {
   (async () => {
      const page = await browser.newPage();
      await page.goto(url);

      const html = await page.content();

      const $ = cheerio.load(html);

      $('h3.product-title a').toArray().forEach((el, i) => {
         const link = $(el).attr('href');
         getProductData.push(link);
      });

      done();
   })();
}, 1);

const getProductData = tress((url, done) => {
   (async () => {
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      const $ = cheerio.load(html);

      let product = {};

      product.title = $('h1.product_title').text();
      product.sku = $('.sku').text();

      const scriptTag = $('div.avada-footer-scripts script[type="application/ld+json"]').html();
      const data = JSON.parse(scriptTag);
      const brand = data['@graph'][1]['brand'];
      product.brand = brand;

      product.price = $('.price').text();
      product.link = $('link').attr('href');
      product.image = $('.avada-product-gallery a').attr('href');
      product.short_description = $('.post-content').find('p:first').text();
      product.categories = $('.posted_in a').text();
      product.tags = $('.tagged_as a').text();
      product.description = $('div.post-content:last').parent().html().replace(/\s+/g, '');
      product.specifications = $('.shop_attributes a').attr('href');

      console.log(product);

      const json = JSON.stringify(product);
      fs.appendFile('products.jsonl', json + '\n', 'utf8', (err) => {
         if (err) {
         console.error(err);
         }
      });
      
      

      // создаем модель для продукта
      const Product = mongoose.model('Product', productSchema);

      const newProduct = new Product(product);
      newProduct.save((error) => {
         if (error) {
            console.log(error);
         } else {
            console.log("Product saved to the database");
         }
      });

      done();
   })();
}, 1);

// создаем схему для продукта
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

startApp();






