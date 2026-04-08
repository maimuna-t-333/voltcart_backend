const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");

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

module.exports = router;