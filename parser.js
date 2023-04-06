const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const tress = require('tress');
// const fs = require('fs');
// const mongoose = require('mongoose')

const Product = require('./api/models/product');

const Parser = require('./api/controllers/parser');



// async function initBrowser() {
//
// }
//
// async function startApp() {
//    await initBrowser();
//
// }

// async function getPageHtml(url, browser) {
//    const page = await browser.newPage();
//    await page.goto(url);
//    const html = await page.content();
//    await page.close();
//    return html;
// }





//// ВЫДВЕТ ОШИБКУ
// getProductUrl.drain(() => {
//    console.log('All URLs processed');
//    getProductData.drain(() => {
//        console.log('All products processed');
//        browser.close();
//    });
// });



// startApp(
//    getProductUrl.drain(() => {
//       console.log('All URLs processed');
//       getProductData.drain(() => {
//             console.log('All products processed');
//             browser.close();
//       });
//    });
// );
exports.Product = Product;
// exports.startApp = startApp;
// exports.getProductUrl = getProductUrl;