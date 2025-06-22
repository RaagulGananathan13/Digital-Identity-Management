const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

router.post('/', hubController.registerListener);
router.delete('/:id', hubController.unregisterListener);

module.exports = router;