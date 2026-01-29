import express from "express";
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice]
 *             properties:
 *               orderItems: { type: array, items: { type: object } }
 *               shippingAddress: { type: object }
 *               paymentMethod: { type: string }
 *               itemsPrice: { type: number }
 *               taxPrice: { type: number }
 *               shippingPrice: { type: number }
 *               totalPrice: { type: number }
 *     responses:
 *       201: { description: Order created }
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of orders }
 */
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of user's orders }
 */
router.route("/myorders").get(protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order details }
 *       404: { description: Order not found }
 */
router.route("/:id").get(protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Update order to paid
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: string }
 *               status: { type: string }
 *               update_time: { type: string }
 *               email_address: { type: string }
 *     responses:
 *       200: { description: Order updated to paid }
 */
router.route("/:id/pay").put(protect, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Update order to delivered (Admin only)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order updated to delivered }
 */
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
