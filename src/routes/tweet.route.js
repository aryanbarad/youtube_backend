import { Router } from "express";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middelware/auth.middelware.js";

const router = Router()

router.use(verifyJWT);

router.route("/createTweet/:userId").post(createTweet)
router.route('/user/:userId').get(getUserTweets)


export default router