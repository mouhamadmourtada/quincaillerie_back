const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Protéger toutes les routes des fournisseurs
router.use(protect);

// Routes CRUD pour les fournisseurs
router.post('/', admin, supplierController.createSupplier.bind(supplierController));
router.get('/', supplierController.getAllSuppliers.bind(supplierController));
router.get('/:id', supplierController.getSupplierById.bind(supplierController));
router.put('/:id', admin, supplierController.updateSupplier.bind(supplierController));
router.delete('/:id', admin, supplierController.deleteSupplier.bind(supplierController));

module.exports = router;
