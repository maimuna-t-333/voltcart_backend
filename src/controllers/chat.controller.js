const { chat }      = require('../services/ai.service');
const ChatSession   = require('../models/ChatSession.model');
const asyncHandler  = require('../utils/asyncHandler');
const ApiError      = require('../utils/ApiError');
const { success }   = require('../utils/ApiResponse');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { sessionId, message, context } = req.body;
  if (!sessionId || !message) throw new ApiError(400, 'sessionId and message required');

  const reply = await chat(sessionId, message, context || {});

  // Persist chat history to MongoDB
  await ChatSession.findOneAndUpdate(
    { sessionId },
    { $push: { messages: [{ role: 'user', content: message }, { role: 'assistant', content: reply }] },
      $set:  { context, user: req.user?._id } },
    { upsert: true }
  );

  success(res, 200, { reply, sessionId });
});
