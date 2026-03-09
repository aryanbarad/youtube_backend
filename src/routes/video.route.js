import { Router } from "express";
import {
    getAllVideo,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"
import { upload } from "../middleware/multer.middelware.js"
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router()
router.use(verifyJWT)

router.route("/")
    .get(getAllVideo)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            },
        ]),
        publishVideo
    );

router.route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router