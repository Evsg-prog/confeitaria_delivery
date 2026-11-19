//backend/routes/catalog.routes.js

const { Router } = require('express');
const controller = require('../controllers/catalog.controller');

const router = Router();
router.get('/categorias', controller.listCategories);
// Compatibilidade temporária com a rota usada na primeira versão do backend.
router.get('/cardapio', controller.listProducts);
router.get('/produtos', controller.listProducts);
router.get('/produtos/:id', controller.getProduct);

module.exports = router;
