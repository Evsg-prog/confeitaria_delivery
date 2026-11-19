//backend/controllers/catalog.controller.js

const service = require('../services/catalog.service');

function listCategories(_request, response) {
  response.json({ data: service.getCategories() });
}

function listProducts(request, response) {
  response.json({ data: service.getProducts(request.query) });
}

function getProduct(request, response) {
  response.json({ data: service.getProduct(request.params.id) });
}

module.exports = { listCategories, listProducts, getProduct };
