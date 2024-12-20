const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', protect, authController.getMe.bind(authController));
router.post('/reset-password', protect, admin, authController.resetPasswordByAdmin.bind(authController));
router.post('/change-password', protect, authController.changePassword.bind(authController));

module.exports = router;
