const router     = require('express').Router();
const rateLimit  = require('express-rate-limit');
const { sendMessage } = require('../controllers/chat.controller');

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,
  message: { success: false, message: 'Chat limit reached. Try again in an hour.' }
});

router.post('/message', chatLimiter, sendMessage);
module.exports = router;
