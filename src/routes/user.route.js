import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser, updateAccountDetails} from "../controllers/user.controller.js";
import { upload } from "../middelware/multer.middelware.js";
import { verifyJWT } from "../middelware/auth.middelware.js";

const router = Router()

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
    router.route('/logout').post(verifyJWT, logoutUser)
    router.route('/refresh-token').post(refreshAccessToken)
    router.route('/change-password').post(verifyJWT, changeCurrentPassword)
    router.route('/update-account').put(verifyJWT, updateAccountDetails)
 


    





export default router