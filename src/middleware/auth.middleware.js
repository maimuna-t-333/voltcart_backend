const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Protect routes (only logged-in users)
exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select("-password -verifyToken -refreshToken -refreshTokens");

  if (!req.user) {
    throw new ApiError(401, "User not found");
  }

  next();
});

// Admin only routes
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};