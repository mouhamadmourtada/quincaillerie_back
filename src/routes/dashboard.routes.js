const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Protéger la route du dashboard
router.use(protect);

// Route pour obtenir les statistiques du dashboard
router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController));

module.exports = router;
