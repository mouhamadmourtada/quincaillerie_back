const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Protéger toutes les routes des catégories
router.use(protect);

// Routes CRUD pour les catégories
router.post('/', admin, categoryController.createCategory.bind(categoryController));
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.put('/:id', admin, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', admin, categoryController.deleteCategory.bind(categoryController));

module.exports = router;
