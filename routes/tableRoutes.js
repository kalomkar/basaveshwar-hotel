const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.route('/')
    .get(authMiddleware, tableController.getTables);

router.route('/:id')
    .put(authMiddleware, tableController.updateTableStatus);

module.exports = router;
