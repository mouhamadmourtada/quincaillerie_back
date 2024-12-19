const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Protéger toutes les routes des ventes
router.use(protect);

// Routes CRUD de base
router.post('/', saleController.createSale.bind(saleController));
router.get('/', saleController.getAllSales.bind(saleController));
router.get('/:id', saleController.getSaleById.bind(saleController));
router.put('/:id', admin, saleController.updateSale.bind(saleController));
router.delete('/:id', admin, saleController.deleteSale.bind(saleController));

// Routes spéciales
router.patch('/:id/status', saleController.updateSaleStatus.bind(saleController));
router.get('/date-range', saleController.getSalesByDateRange.bind(saleController));
router.get('/customer/:customerPhone', saleController.getSalesByCustomer.bind(saleController));

module.exports = router;
