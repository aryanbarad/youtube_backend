import { Router } from "express";
import { createTweet, getUserTweets, updateTweet , deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middelware/auth.middelware.js";

const router = Router()

router.use(verifyJWT);

router.route("/createTweet/:userId").post(createTweet)
router.route('/user/:userId').get(getUserTweets)
router.route("/update/:tweetId").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)



export default router