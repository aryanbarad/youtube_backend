import { Router } from "express";
import { createTweet, getUserTweets, updateTweet , deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router()


router.use(verifyJWT);
/**
 * @swagger
 * /api/tweets:
 *   post:
 *     summary: Create tweet
 *     tags: [Tweets]
 *     responses:
 *       200:
 *         description: Tweet created
 */
router.route("/createTweet/:userId").post(createTweet)
router.route('/user/:userId').get(getUserTweets)
router.route("/update/:tweetId").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)



export default router