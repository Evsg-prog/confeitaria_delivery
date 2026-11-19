//backend/database/connection.js

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const databaseDirectory = __dirname;
fs.mkdirSync(databaseDirectory, { recursive: true });

const databasePath = path.join(databaseDirectory, 'confeitaria.sqlite');
const database = new DatabaseSync(databasePath);

database.exec('PRAGMA foreign_keys = ON;');
database.exec('PRAGMA journal_mode = WAL;');

module.exports = database;


const imagens = [
  ['bolo1.jpeg', 1],
  ['bolo2.jpeg', 2],
  ['brigadeiros.jpeg', 3],
  ['brigadeiros.jpeg', 4],
  ['fatia1.jpeg', 5],
  ['fatia2.jpeg', 6],
  ['tortadelimao.jpeg', 7],
  ['bolo3.jpeg', 8]
];

const atualizarImagem = database.prepare(
  'UPDATE produtos SET imagem = ? WHERE id = ?'
);

for (const [imagem, id] of imagens) {
  atualizarImagem.run(imagem, id);
}
