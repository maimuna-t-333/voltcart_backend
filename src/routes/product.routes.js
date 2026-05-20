const router = require('express').Router();
const c = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadImages } = require('../middleware/upload.middleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err && decoded) {
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  });
};

router.get('/',           optionalAuth,c.getProducts);
router.get('/featured',   c.getFeaturedProducts);
router.get('/:slug',      c.getProductBySlug);
router.post('/',          protect, adminOnly, c.createProduct);
router.patch('/:id',      protect, adminOnly, c.updateProduct);
router.delete('/:id',     protect, adminOnly, c.deleteProduct);
router.post('/:id/images',protect, adminOnly, uploadImages, c.uploadProductImages);

module.exports = router;
