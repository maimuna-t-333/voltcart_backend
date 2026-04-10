const router = require('express').Router();
const { getCart, addItem, applyCoupon } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',        protect, getCart);
router.post('/add',    protect, addItem);
router.post('/coupon', protect, applyCoupon);

module.exports = router;
