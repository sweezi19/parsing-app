const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const tress = require('tress');
const nodemon = require('nodemon');
const fs = require('fs');



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
      // console.log(url)
      const html = await page.content();
      const $ = cheerio.load(html);

      let product = {};

      product.title = $('h1.product_title').text();
      product.sku = $('.sku').text();
      // product.brand = $('').text();
      product.price = $('.price').text();
      product.link = $('link').attr('href');
      product.image = $('.avada-product-gallery a').attr('href');
      product.short_description = $('.post-content').find('p:first').text();
      product.categories = $('.posted_in a').text();
      product.tags = $('.tagged_as a').text();
      product.description = $('div.post-content:last').parent().html().replace(/\s+/g, '');
      product.specifications = $('.shop_attributes a').attr('href');

      // products.push(product); 
      console.log(product);
      // console.log(products);

      const json = JSON.stringify(product);
      fs.appendFile('products.jsonl', json + '\n', 'utf8', (err) => {
         if (err) {
         console.error(err);
         }
      });
      

      done();
   })();
}, 1);



startApp();