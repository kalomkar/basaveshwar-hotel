const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware, roleMiddleware(['manager']), reportController.getDashboardSummary);

module.exports = router;
