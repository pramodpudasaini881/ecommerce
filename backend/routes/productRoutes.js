import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with search and filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *         description: Search keyword
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Category ID
 *       - in: query
 *         name: pageNumber
 *         schema: { type: integer }
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of products with pagination details
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Product not found }
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, image, category]
 *             properties:
 *               name: { type: string, example: Sample Product }
 *               description: { type: string, example: Product description }
 *               price: { type: number, example: 199.99 }
 *               countInStock: { type: number, example: 10 }
 *               image: { type: string, example: /images/sample.jpg }
 *               category: { type: string, example: 60d5ecb8b487342e6884048d }
 *     responses:
 *       201: { description: Product created }
 *       401: { description: Not authorized }
 */
router.post("/", protect, admin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               countInStock: { type: number }
 *               image: { type: string }
 *               category: { type: string }
 *     responses:
 *       200: { description: Product updated }
 *       404: { description: Product not found }
 */
router.put("/:id", protect, admin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted }
 *       404: { description: Product not found }
 */
router.delete("/:id", protect, admin, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating: { type: number, example: 5 }
 *               comment: { type: string, example: Great product! }
 *     responses:
 *       201: { description: Review added }
 *       400: { description: Product already reviewed }
 *       404: { description: Product not found }
 */
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
