import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   name: { type: string }
 *                   description: { type: string }
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name: { type: string, example: Electronics }
 *               description: { type: string, example: Electronic gadgets and devices }
 *     responses:
 *       201: { description: Category created }
 *       400: { description: Category already exists }
 *       401: { description: Not authorized }
 */
router.post("/", protect, admin, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
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
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Category updated }
 *       404: { description: Category not found }
 */
router.put("/:id", protect, admin, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category removed }
 *       404: { description: Category not found }
 */
router.delete("/:id", protect, admin, deleteCategory);

export default router;
