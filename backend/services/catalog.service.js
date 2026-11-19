const repository = require('../repositories/catalog.repository');

function getCategories() {
  return repository.listCategories();
}

function getProducts(query) {
  const search = typeof query.search === 'string' ? query.search.trim().slice(0, 80) : '';
  const category = typeof query.category === 'string' ? query.category.trim() : '';
  const featured = query.featured === 'true' ? true : undefined;

  return repository.listProducts({ search, category, featured });
}

function getProduct(idValue) {
  const id = Number.parseInt(idValue, 10);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('Identificador de produto inválido.');
    error.status = 400;
    throw error;
  }

  const product = repository.findProductById(id);
  if (!product) {
    const error = new Error('Produto não encontrado.');
    error.status = 404;
    throw error;
  }
  return product;
}

module.exports = { getCategories, getProducts, getProduct };
