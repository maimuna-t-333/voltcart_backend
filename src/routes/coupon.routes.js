const router = require('express').Router();
const c = require('../controllers/coupon.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/validate',  protect, c.validateCoupon);         
router.get('/',           protect, adminOnly, c.getAllCoupons);
router.post('/',          protect, adminOnly, c.createCoupon);
router.patch('/:id',      protect, adminOnly, c.updateCoupon);
router.delete('/:id',     protect, adminOnly, c.deleteCoupon);

module.exports = router;