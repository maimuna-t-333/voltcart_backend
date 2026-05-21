const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth.middleware");
const User = require("../models/User.model");
const Order = require("../models/Order.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      wishlist: req.user.wishlist,
      addresses: req.user.addresses,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
    message: "Profile fetched successfully",
  });
});

router.get("/", protect, adminOnly, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = { role: "customer" };
  if (search) {
    query.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password -verifyToken -resetToken -refreshToken")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  success(res, 200, { users, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

router.post("/wishlist/:productId", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
 
  if (user.wishlist.some(id => id.toString() === productId)) {
    return success(res, 200, { wishlist: user.wishlist }, "Already in wishlist");
  }
 
  user.wishlist.push(productId);
  await user.save();
  success(res, 200, { wishlist: user.wishlist }, "Added to wishlist");
}));

router.delete("/wishlist/:productId", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
  await user.save();
  success(res, 200, { wishlist: user.wishlist }, "Removed from wishlist");
}));

router.get("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password -verifyToken -resetToken -refreshToken");
  if (!user) throw new ApiError(404, "Customer not found");

  const orders = await Order.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(20);

  const totalSpent = orders
    .filter(o => !["cancelled", "refunded"].includes(o.status))
    .reduce((sum, o) => sum + (o.total || 0), 0);

  success(res, 200, { user, orders, totalSpent });
}));

module.exports = router;