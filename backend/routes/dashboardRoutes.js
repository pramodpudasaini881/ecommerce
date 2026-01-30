import express from "express";
import {
    getDashboardStats,
    getSalesAnalytics,
    getRecentOrders,
    getCategoryDistribution,
} from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard analytics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard summary stats (Admin only)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Summary statistics
 */
router.get("/stats", protect, admin, getDashboardStats);

/**
 * @swagger
 * /api/dashboard/sales:
 *   get:
 *     summary: Get monthly sales data (Admin only)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Sales trend data
 */
router.get("/sales", protect, admin, getSalesAnalytics);

/**
 * @swagger
 * /api/dashboard/recent-orders:
 *   get:
 *     summary: Get 5 most recent orders (Admin only)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of recent orders
 */
router.get("/recent-orders", protect, admin, getRecentOrders);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get product distribution by category (Admin only)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Category distribution data
 */
router.get("/categories", protect, admin, getCategoryDistribution);

export default router;
