//backend/repositories/catalog.repository.js

const database = require('../database/connection');

function listCategories() {
  return database.prepare(`
    SELECT id, nome AS name, slug, descricao AS description
    FROM categorias
    WHERE ativa = 1
    ORDER BY nome COLLATE NOCASE
  `).all();
}

function listProducts({ category, search, featured, availableOnly = true } = {}) {
  const conditions = [];
  const parameters = [];

  if (availableOnly) conditions.push('p.disponivel = 1');
  if (category) {
    conditions.push('c.slug = ?');
    parameters.push(category);
  }
  if (search) {
    conditions.push('(p.nome LIKE ? OR p.descricao LIKE ?)');
    parameters.push(`%${search}%`, `%${search}%`);
  }
  if (featured === true) conditions.push('p.destaque = 1');

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return database.prepare(`
    SELECT
      p.id,
      p.nome AS name,
      p.descricao AS description,
      p.preco_centavos AS priceInCents,
      p.imagem AS image,
      p.destaque AS featured,
      p.disponivel AS available,
      c.id AS categoryId,
      c.nome AS categoryName,
      c.slug AS categorySlug
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    ${where}
    ORDER BY p.destaque DESC, p.nome COLLATE NOCASE
  `).all(...parameters).map((product) => ({
    ...product,
    price: product.priceInCents / 100,
    featured: Boolean(product.featured),
    available: Boolean(product.available)
  }));
}

function findProductById(id) {
  return listProducts({ availableOnly: false }).find((product) => product.id === id) || null;
}

module.exports = { listCategories, listProducts, findProductById };
