import mongoose , {isValidObjectId} from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandeler } from "../utils/asyncHandler.js"


const craetePlayList = asyncHandeler(async(req,res)=>{
    const {name, description} = req.body
     
    if(!name || !description){
        throw new ApiError(400,"name amd description are required")
    }

// craete playlist
    const PlayList = await Playlist.create({
        name:name.trim(),
        description:description.trim(),
        owner:req.user._id,
        videos:[] //start with empty videos arry 
    })


    //fetch create playlist with owner deatails

    const createplyList = await Playlist.findById(PlayList._id).populate("owner","username fullname avatar")

    return res
    .status(200)
    .json(new ApiResponse(200,craetePlayList,"palylist create successfully"))

})

