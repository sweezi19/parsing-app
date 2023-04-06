const tress = require('tress');
const cheerio = require('cheerio');
const Product = require('../models/product');
const puppeteer = require('puppeteer');

let browser = null;

exports.startParse = async (req, res) => {
    browser = await puppeteer.launch({
    });

    for (let i = 1; i <= 2019; i++) {
        getProductUrl.push(`https://control-products.com/shop-products/page/${i}`);
    }
    res.status(200).json({
        message: 'ok'
    });
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
        await page.close();
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

        product.price = $('.entry-summary bdi').text().replace(/[^0-9.]/g, '');
        product.link = $('link').attr('href');
        product.image = $('.avada-product-gallery a').attr('href');
        product.short_description = $('.post-content').find('p:first').text();
        product.categories = $('.posted_in a').text();
        product.tags = $('.tagged_as a').text();
        product.description = $('div.post-content:last').parent().html().replace(/\s+/g, '');
        product.specifications = $('.shop_attributes a').attr('href');

        console.log(product);

        const newProduct = new Product(product);
        newProduct.save((error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Product saved to the database");
            }
        });
        product = {};
        setTimeout(() => {
            done(null, product);
        }, 500);
        await page.close();
    })();
}, 1);