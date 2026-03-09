import { Router } from "express";
import {getChannelState,
    getChannelVideos}from "../controllers/deshbord.controller.js"

import { verifyJWT } from "../middleware/auth.middelware.js";
import { get } from "mongoose";

const router = Router()


router.use(verifyJWT)

router.route('/state').get(getChannelState)
router.route('/video'),get(getChannelVideos)


export default router
