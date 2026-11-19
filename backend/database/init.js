const fs = require('node:fs');
const path = require('node:path');
const database = require('./connection');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
database.exec(schema);

const categoryCount = database.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;

if (categoryCount === 0) {
  const insertCategory = database.prepare(
    'INSERT INTO categorias (nome, slug, descricao) VALUES (?, ?, ?)'
  );

  const categories = [
    ['Bolos', 'bolos', 'Bolos feitos para deixar qualquer ocasião mais especial.'],
    ['Doces', 'doces', 'Pequenos momentos de felicidade em forma de doce.'],
    ['Brownies', 'brownies', 'Brownies macios, intensos e cheios de chocolate.'],
    ['Tortas', 'tortas', 'Tortas para compartilhar ou aproveitar sem pressa.']
  ];

  const categoryIds = new Map();
  for (const category of categories) {
    const result = insertCategory.run(...category);
    categoryIds.set(category[1], Number(result.lastInsertRowid));
  }

  const insertProduct = database.prepare(`
    INSERT INTO produtos
      (categoria_id, nome, descricao, preco_centavos, destaque, disponivel)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  const products = [
    ['bolos', 'Bolo de chocolate', 'Massa fofinha de chocolate com cobertura cremosa.', 4500, 1],
    ['bolos', 'Bolo de cenoura', 'Bolo de cenoura com cobertura de brigadeiro.', 3800, 1],
    ['doces', 'Brigadeiro tradicional', 'Brigadeiro artesanal com chocolate granulado.', 450, 1],
    ['doces', 'Beijinho', 'Doce de coco finalizado com coco ralado.', 400, 0],
    ['brownies', 'Brownie clássico', 'Casquinha crocante por fora e interior macio.', 900, 1],
    ['brownies', 'Brownie com doce de leite', 'Brownie de chocolate com recheio de doce de leite.', 1200, 0],
    ['tortas', 'Torta de limão', 'Base crocante, creme de limão e cobertura suave.', 5500, 0],
    ['tortas', 'Torta de morango', 'Creme leve, morangos frescos e massa amanteigada.', 6200, 1]
  ];

  for (const [slug, name, description, price, featured] of products) {
    insertProduct.run(categoryIds.get(slug), name, description, price, featured);
  }
}

module.exports = database;
