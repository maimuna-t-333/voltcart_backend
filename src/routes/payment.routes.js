const router = require('express').Router();
const { createIntent } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/intent', protect, createIntent);

module.exports = router;
