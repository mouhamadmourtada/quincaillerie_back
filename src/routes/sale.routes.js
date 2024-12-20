const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const { createSaleSchema, updateSaleSchema } = require('../dtos/sale.dto');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');

// Protéger toutes les routes
router.use(protect);

// Routes principales
router.post('/', validate(createSaleSchema), saleController.createSale);
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);
router.patch('/:id', validate(updateSaleSchema), saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

// Routes spécifiques
router.get('/date-range', saleController.getSalesByDateRange);
router.get('/customer/:customerPhone', saleController.getSalesByCustomerPhone);
router.get('/payment-type/:paymentType', saleController.getSalesByPaymentType);

// Routes de gestion du statut
router.post('/:id/pay', saleController.markSaleAsPaid);
router.post('/:id/cancel', saleController.cancelSale);

module.exports = router;
