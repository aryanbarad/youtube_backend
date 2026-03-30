import { Router } from "express";
import {healthCheck} from "../controllers/healthCheck.controller.js"

const router = Router()

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     summary: Verify server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy and running
 */
router.route('/').get(healthCheck)

export default router