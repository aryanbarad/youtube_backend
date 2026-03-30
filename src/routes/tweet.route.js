import { Router } from "express";
import { createTweet, getUserTweets, updateTweet , deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";

const router = Router()


router.use(verifyJWT);
/**
 * @swagger
 * /api/v1/tweets/createTweet/{userId}:
 *   post:
 *     summary: Create a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Tweet created
 */
router.route("/createTweet/:userId").post(createTweet)

/**
 * @swagger
 * /api/v1/tweets/user/{userId}:
 *   get:
 *     summary: Get user tweets
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweets retrieved
 */
router.route('/user/:userId').get(getUserTweets)

/**
 * @swagger
 * /api/v1/tweets/update/{tweetId}:
 *   patch:
 *     summary: Update a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet updated
 */
router.route("/update/:tweetId").patch(updateTweet)

/**
 * @swagger
 * /api/v1/tweets/delete/{tweetId}:
 *   delete:
 *     summary: Delete a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet deleted
 */
router.route("/delete/:tweetId").delete(deleteTweet)



export default router