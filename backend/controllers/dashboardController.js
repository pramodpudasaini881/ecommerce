import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const orders = await Order.find({});
        const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);

        res.json({
            totalSales,
            totalOrders,
            totalUsers,
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly sales analytics
// @route   GET /api/dashboard/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
    try {
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product distribution by category
// @route   GET /api/dashboard/categories
// @access  Private/Admin
export const getCategoryDistribution = async (req, res) => {
    try {
        const distribution = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: "$categoryDetails",
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    name: "$categoryDetails.name",
                },
            },
        ]);

        res.json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
