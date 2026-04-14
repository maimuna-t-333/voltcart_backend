const NodeCache = require('node-cache');
const Product   = require('../models/Product.model');

const cache = new NodeCache({ stdTTL: 3600 });

const SYSTEM_PROMPT = `You are TechBot, the helpful shopping assistant for TechVault, an online gadget store. You help customers find products, answer spec questions, compare gadgets, and assist with checkout. Store policies: free shipping over $50, 30-day returns, 2-year warranty on electronics. Keep replies concise (2-4 sentences). Never make up product details not provided to you. If asked something outside your scope, politely redirect to the store topic.`;

exports.chat = async (sessionId, userMessage, context = {}) => {
  let history = cache.get(sessionId) || [];

  let contextPrefix = '';
  if (context.currentProductSlug) {
    const product = await Product.findOne({ slug: context.currentProductSlug })
      .select('name brand basePrice specs variants avgRating');
    if (product) {
      const specsText = product.specs.map(s => `${s.key}: ${s.value}`).join(', ');
      contextPrefix = `[User is viewing: ${product.name} by ${product.brand}, Price: $${product.basePrice}, Rating: ${product.avgRating}/5, Specs: ${specsText}] `;
    }
  }

  history.push({ role: 'user', content: contextPrefix + userMessage });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  history.push({ role: 'assistant', content: reply });
  if (history.length > 20) history = history.slice(-20);
  cache.set(sessionId, history);

  return reply;
};