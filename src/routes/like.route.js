import { Router } from "express"
import {
        getlikedvideo,
        ToggleTweetLike,
        ToggleCommentLike,
        ToggleVideoLike
        } from "../controllers/like.controller.js"

import { verifyJWT } from "../middleware/auth.middelware.js"

const router = Router();

router.use(verifyJWT)


/**
 * @swagger
 * /api/v1/likes/toggele/v/{videoId}:
 *   post:
 *     summary: Toggle like for a video
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.route("/toggele/v/:videoId").post(ToggleVideoLike)

/**
 * @swagger
 * /api/v1/likes/toggele/v/{commentId}:
 *   post:
 *     summary: Toggle like for a comment
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.route('/toggele/v/:commentId').post(ToggleCommentLike)

/**
 * @swagger
 * /api/v1/likes/toggele/v/{tweetId}:
 *   post:
 *     summary: Toggle like for a tweet
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.route('/toggele/v/:tweetId').post(ToggleTweetLike)

/**
 * @swagger
 * /api/v1/likes/video:
 *   get:
 *     summary: Get all liked videos
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liked videos retrieved
 */
router.route('/video').post(getlikedvideo)

export default router