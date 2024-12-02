const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/ProductListing');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'no-cache',
};


const getAmazonProductDetails = async (url) => {
  try {
    // Fetch the page content
    const response = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(response.data);
    // Focus on the specific div with id="ppd"
    const ppd = $('#ppd');

    // Extract title
    const title = ppd.find('#productTitle').text().trim() || 'N/A';

    // Extract price
    const priceWhole = ppd.find('.a-price-whole').first().text().trim() || 'N/A';

    const priceFraction = ppd.find('.a-price-fraction').first().text().trim() || '';

    const price = priceWhole !== 'N/A' ? `${priceWhole}${priceFraction}` : 'N/A';

    let basisPrice = 'N/A';
    const basisPriceElement = ppd.find('span.basisPrice');
    if (basisPriceElement.length) {
      const oldPriceSpan = basisPriceElement.find('span.a-offscreen');
      basisPrice = oldPriceSpan.text().trim().replace(/^S\$/, '') || 'N/A';
    }

    // Compile the data
    return {
      title,
      price,
      basisPrice
    };
  } catch (error) {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Failed to scrape product details.');
  }
};

const fetchAndProcessUrls = async () => {
  try {
    // Fetch all products with an Amazon URL
    const products = await Product.find({ amazonUrl: { $exists: true } });

    const results = [];
    for (const product of products) {
      console.log(`Scraping URL: ${product.amazonUrl}`);
      try {
        const details = await getAmazonProductDetails(product.amazonUrl);

        if (details) {
          const result = {
            productId: product._id,
            amazonUrl: product.amazonUrl,
            title: details.title,
            price: details.price,
            basisPrice: details.basisPrice,
          };
          if (validatePrice(details.price)) {
            product.discountPrice = parseFloat(details.price);
          }
          if (details.basisPrice === 'N/A') {
            product.price = 0;
          } else if (validatePrice(details.basisPrice)) {
            product.price = parseFloat(details.basisPrice);
          }

          await product.save();
          results.push(result);
        }
      } catch (error) {
        console.log('Error processing:', product, error);
      }
    }
    console.log('All Results:', results);
    return results;
  } catch (error) {
    console.log('Error fetching or processing URLs:', error);
    throw new Error('Failed to process product URLs.');
  }
};

const validatePrice = (price) => {
  const pricePattern = /^\d+(\.\d{1,2})?$/;
  return pricePattern.test(price);
};

module.exports = { fetchAndProcessUrls }