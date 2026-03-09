import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middelware.js";
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router()

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User registered successfully
 */

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1

        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), registerUser)


router.route('/login').post(loginUser)


// protected routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route('/update-account').patch(verifyJWT, updateAccountDetails)
router.route( "/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage),
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)








export default router