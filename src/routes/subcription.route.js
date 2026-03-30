import { Router } from "express";
import {
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels,
} from "../controllers/subcription.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";


const router = Router()

router.use(verifyJWT)

/**
 * @swagger
 * /api/v1/subscriptions/c/{channelId}:
 *   get:
 *     summary: Get user channel subscribers
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribers retrieved
 *   post:
 *     summary: Toggle subscription status
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription toggled
 */
router.route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)

/**
 * @swagger
 * /api/v1/subscriptions/u/{subscriberId}:
 *   get:
 *     summary: Get subscribed channels for a user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribed channels retrieved
 */
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;