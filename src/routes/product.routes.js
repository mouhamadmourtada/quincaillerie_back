const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Protéger toutes les routes des produits
router.use(protect);

// Routes CRUD pour les produits
router.post('/', admin, productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', admin, productController.updateProduct.bind(productController));
router.delete('/:id', admin, productController.deleteProduct.bind(productController));

// Routes additionnelles
router.get('/category/:categoryId', productController.getProductsByCategory.bind(productController));
router.patch('/:id/stock', admin, productController.updateStock.bind(productController));

module.exports = router;
