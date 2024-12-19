const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

router.use(protect); // Protège toutes les routes

router.get('/', admin, userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', admin, userController.deleteUser.bind(userController));

module.exports = router;
