'use strict';

const { products } = require('./mocks/data');

module.exports.getProductsList = async (_event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products, null, 2),
  };
};
