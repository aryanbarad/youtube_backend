import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middelware.js"
import {
    getUserPlayList,
    craetePlayList,
    getPlayListById,
    addVideoToPlaylist,
    deletePlaylist,
    removeVideoFromplaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"

const router = Router();

router.use(verifyJWT)
/**
 * @swagger
 * /api/v1/playList:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Playlist created
 */
router.route('/').post(craetePlayList)

/**
 * @swagger
 * /api/v1/playList/{playlistId}:
 *   get:
 *     summary: Get playlist details
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist details
 *   patch:
 *     summary: Update playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist updated
 *   delete:
 *     summary: Delete playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 */
router.route('/:playlistId')
    .get(getUserPlayList)
    .patch(updatePlaylist)
    .delete(deletePlaylist)

/**
 * @swagger
 * /api/v1/playList/add/{videoId}/{playlistId}:
 *   patch:
 *     summary: Add video to playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video added to playlist
 */
router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist)

/**
 * @swagger
 * /api/v1/playList/remove/{videoId}/{playlistId}:
 *   patch:
 *     summary: Remove video from playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video removed from playlist
 */
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromplaylist)

/**
 * @swagger
 * /api/v1/playList/user/{userId}:
 *   get:
 *     summary: Get user playlists
 *     tags: [Playlist]
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
 *         description: Playlists retrieved
 */
router.route('/user/:userId').get(getPlayListById)


    export default router
