import { Router } from "express";
import {getChannelState,
    getChannelVideos}from "../controllers/deshbord.controller.js"

import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router()


router.use(verifyJWT)

/**
 * @swagger
 * /api/v1/dashboard/state:
 *   get:
 *     summary: Get channel state/statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel status retrieved successfully
 */
router.route('/state').get(getChannelState)

/**
 * @swagger
 * /api/v1/dashboard/video:
 *   get:
 *     summary: Get all videos for the channel dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel videos retrieved successfully
 */
router.route('/video').get(getChannelVideos)


export default router
