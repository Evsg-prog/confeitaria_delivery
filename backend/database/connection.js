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
