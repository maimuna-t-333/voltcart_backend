const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');
const Coupon = require('../models/Coupon.model');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.getDashboardKPI = asyncHandler(async (req, res) => {
  const today = startOfDay();

  const [
    totalRevenueResult,
    totalOrders,
    totalUsers,
    totalProducts,
    todayRevenueResult,
    todayOrders,
    aovResult,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ status: 'active' }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, avg: { $avg: '$total' } } },
    ]),
  ]);

  success(res, 200, {
    totalRevenue: totalRevenueResult[0]?.total || 0,
    totalOrders,
    totalUsers,
    totalProducts,
    todayRevenue: todayRevenueResult[0]?.total || 0,
    todayOrders,
    averageOrderValue: Math.round((aovResult[0]?.avg || 0) * 100) / 100,
  });
});

exports.getRevenueTrends = asyncHandler(async (req, res) => {
  let { period, startDate, endDate } = req.query;
  period = period || 'day';

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

  let dateFormat;
  if (period === 'week') dateFormat = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
  else if (period === 'month') dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
  else dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

  const trends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $nin: ['cancelled', 'refunded'] },
      },
    },
    {
      $group: {
        _id: dateFormat,
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: '$_id',
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  success(res, 200, { trends, period, startDate: start, endDate: end });
});

exports.getOrderStats = asyncHandler(async (req, res) => {
  const statusDistribution = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
    { $sort: { count: -1 } },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email')
    .lean();

  success(res, 200, { statusDistribution, recentOrders });
});

exports.getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const topProducts = await Product.find({ status: 'active' })
    .sort({ soldCount: -1 })
    .limit(limit)
    .select('name brand category basePrice soldCount avgRating reviewCount')
    .lean();

  success(res, 200, { topProducts });
});

exports.getRevenueByCategory = asyncHandler(async (req, res) => {
  const categoryRevenue = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Unknown'] },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        unitsSold: { $sum: '$items.quantity' },
      },
    },
    {
      $project: { _id: 0, category: '$_id', revenue: 1, unitsSold: 1 },
    },
    { $sort: { revenue: -1 } },
  ]);

  success(res, 200, { categoryRevenue });
});

exports.getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'customer' });

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [newThisMonth, newLastMonth, registrationTrend] = await Promise.all([
    User.countDocuments({ role: 'customer', createdAt: { $gte: thisMonth } }),
    User.countDocuments({
      role: 'customer',
      createdAt: { $gte: lastMonth, $lt: thisMonth },
    }),
    User.aggregate([
      { $match: { role: 'customer' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1 } },
    ]),
  ]);

  success(res, 200, { totalUsers, newThisMonth, newLastMonth, registrationTrend });
});

exports.getAbandonedCarts = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const abandonedCarts = await Cart.find({
    updatedAt: { $gte: thirtyDaysAgo },
  })
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  const totalAbandoned = await Cart.countDocuments({
    updatedAt: { $gte: thirtyDaysAgo },
  });

  success(res, 200, { totalAbandoned, abandonedCarts });
});

exports.getCouponStats = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
    .select('code type value usesCount maxUses isActive expiresAt')
    .sort({ usesCount: -1 })
    .lean();

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usesCount, 0);

  success(res, 200, { totalCoupons, activeCoupons, totalUses, coupons });
});
