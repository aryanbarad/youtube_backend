import {Router} from "express";
import { addComment,getVideoComments,updateComment,deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router();

router.use(verifyJWT)

/**
 * @swagger
 * /api/v1/comment/{videoId}:
 *   get:
 *     summary: Get comments for a video
 *     tags: [Comments]
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
 *         description: Comments retrieved
 *   post:
 *     summary: Add a comment to a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.route('/:videoId').get(getVideoComments).post(addComment)

/**
 * @swagger
 * /api/v1/comment/c/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
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
 *         description: Comment deleted
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
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
 *         description: Comment updated
 */
router.route('/c/:commentId').delete(deleteComment).patch(updateComment)

export default router