import { Router } from "express";
import {
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middelware/auth.middelware.js";


const router = Router()

router.route(verifyJWT)

router.route("c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;