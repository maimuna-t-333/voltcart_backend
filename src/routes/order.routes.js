const router = require('express').Router();
const c = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/my-orders',     protect, c.getMyOrders);
router.get('/:id',           protect, c.getOrderById);
router.get('/',              protect, adminOnly, c.getAllOrders);
router.patch('/:id/status',  protect, adminOnly, c.updateOrderStatus);

module.exports = router;
