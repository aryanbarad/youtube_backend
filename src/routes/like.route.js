import { Router } from "express"
import {
        getlikedvideo,
        ToggleTweetLike,
        ToggleCommentLike,
        ToggleVideoLike
        } from "../controllers/like.controller.js"

import { verifyJWT } from "../middelware/auth.middelware.js"

const router = Router();

router.use(verifyJWT)


router.route("/toggele/v/:videoId").post(ToggleVideoLike)
router.route('/toggele/v/:commentId').post(ToggleCommentLike)
router.route('/toggele/v/:tweetId').post(ToggleTweetLike)
router.route('/video').post(getlikedvideo)

export default router