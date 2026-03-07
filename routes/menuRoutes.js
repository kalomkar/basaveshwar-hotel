const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.route('/')
    .get(menuController.getMenuItems) // Public access for website
    .post(authMiddleware, roleMiddleware(['manager']), menuController.addMenuItem);

router.route('/:id')
    .put(authMiddleware, roleMiddleware(['manager']), menuController.updateMenuItem);

router.route('/:id/availability')
    .patch(authMiddleware, roleMiddleware(['manager']), menuController.toggleAvailability);

module.exports = router;
