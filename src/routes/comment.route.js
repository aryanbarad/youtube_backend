import {Router} from "express";
import { addComment,getVideoComments,updateComment,deleteComment } from "../controllers/comment.controller";
import { verifyJWT } from "../middelware/auth.middelware";

const router = Router();

router.use(verifyJWT)


router.route('/:videoId').get(getVideoComments).post(addComment)
router.route('/c/:commentId').delete(deleteComment).patch(updateComment)

export default router