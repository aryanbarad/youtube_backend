import {Router} from "express";
import { addComment,getVideoComments,updateComment,deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router();

router.use(verifyJWT)

/**
 * @swagger
 * /api/comment/{videoId}:
 *   get:
 *     summary: Get comments
 *     tags: [Comments]
 */
router.route('/:videoId').get(getVideoComments).post(addComment)
router.route('/c/:commentId').delete(deleteComment).patch(updateComment)

export default router