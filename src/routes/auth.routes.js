const router = require('express').Router();
const { register, login, logout, refreshToken } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const rateLimit  = require('express-rate-limit');

const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 5,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

router.post('/register',      register);
router.post('/login',         loginLimiter, login);
router.post('/logout',        protect, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
