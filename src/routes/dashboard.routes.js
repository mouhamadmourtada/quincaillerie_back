const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protéger toutes les routes
router.use(protect);

// Routes du tableau de bord
router.get('/stats', dashboardController.getDashboardStats);
router.get('/sales', dashboardController.getSalesStats);
router.get('/inventory', dashboardController.getInventoryStats);

module.exports = router;
