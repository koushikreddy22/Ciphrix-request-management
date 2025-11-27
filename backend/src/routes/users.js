
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/employees', authMiddleware, userController.getEmployees);

module.exports = router;
