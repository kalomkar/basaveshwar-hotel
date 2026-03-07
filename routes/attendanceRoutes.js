const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/clock-in', authMiddleware, attendanceController.clockIn);
router.put('/clock-out', authMiddleware, attendanceController.clockOut);
router.get('/reports', authMiddleware, roleMiddleware(['manager']), attendanceController.getReports);

module.exports = router;
