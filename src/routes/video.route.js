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
/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management APIs
 */



/**
 * @swagger
 * /api/v1/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.route("/").get(getAllVideo)
   

/**
 * @swagger
 * /api/v1/videos:
 *   post:
 *     summary: Upload a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - videoFile
 *               - thumbnail
 *               - title
 *               - description
 *               - duration
 *             properties:
 *               videoFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Video uploaded
 */
router.route("/").post(
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



/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 */
router.route("/:videoId").get(getVideoById)
    
    
/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   delete:
 *     summary: Delete video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 */
router.route("/:videoId").delete(deleteVideo)


/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   patch:
 *     summary: Update video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 */
router.route("/:videoId").patch(upload.single("thumbnail"), updateVideo)



/**
 * @swagger
 * /api/v1/videos/toggle/publish/{videoId}:
 *  patch:
 *     summary: Toggle publish status
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 */
router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router