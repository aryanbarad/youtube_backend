import { Router } from "express";
import {
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";


const router = Router()

router.use(verifyJWT)

router.route("c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;