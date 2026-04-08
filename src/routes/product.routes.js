const router = require('express').Router();
const c = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadImages } = require('../middleware/upload.middleware');

router.get('/',           c.getProducts);
router.get('/featured',   c.getFeaturedProducts);
router.get('/:slug',      c.getProductBySlug);
router.post('/',          protect, adminOnly, c.createProduct);
router.patch('/:id',      protect, adminOnly, c.updateProduct);
router.delete('/:id',     protect, adminOnly, c.deleteProduct);
router.post('/:id/images',protect, adminOnly, uploadImages, c.uploadProductImages);

module.exports = router;
