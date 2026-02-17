import { Router } from "express"
import { verifyJWT } from "../middelware/auth.middelware.js"
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

router.route('/').post(craetePlayList)


router
    .route('/:playlistId')
    .get(getUserPlayList)
    .patch(updatePlaylist)
    .delete(deletePlaylist)



    router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist)
    router.route('/remove/:videoId/:playlistId').patch(removeVideoFromplaylist)

    router.route('/user/:userId').get(getPlayListById)


    export default router

