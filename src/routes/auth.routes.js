const router = require('express').Router();
const c = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',      c.register);
router.post('/login',         c.login);
router.post('/refresh-token', c.refreshToken);
router.post('/logout',        protect, c.logout);

module.exports = router;