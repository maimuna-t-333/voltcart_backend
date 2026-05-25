const express = require('express');
const router  = express.Router();
const {
  subscribe,
  confirmSubscription,
  unsubscribe,
} = require('../controllers/subscribe.controller');

router.post('/',            subscribe);           
router.get('/confirm',      confirmSubscription); 
router.get('/unsubscribe',  unsubscribe);         

module.exports = router;