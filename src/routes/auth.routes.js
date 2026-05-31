const router = require('express').Router();
const { register, login, refreshToken, logout,verifyEmail, forgotPassword, resetPassword, } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/register', limiter, register);
router.post('/login', limiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get( '/verify-email', verifyEmail);
router.post('/forgot-password', limiter, forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
