const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const tress = require('tress');
const nodemon = require('nodemon');


async function parsePage(url) {
  const browser = await puppeteer.launch({
   // headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);

  const html = await page.content();

  const $ = cheerio.load(html);


const links = [];

$('h3.product-title a').toArray().forEach((el, i) => {
  const link = $(el).attr('href');
  links.push(link);
});

console.log(`${links}`);

//   await browser.close();
}


const queue = tress((url, callback) => {
  parsePage(url).then(() => {
    callback();
  });
}, 1); 

for (let i = 1; i <= 2025; i++) {
  queue.push(`https://control-products.com/shop-products/page/${i}`);
}


queue



