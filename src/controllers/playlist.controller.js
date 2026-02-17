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


const getUserPlayList =asyncHandeler(async(req,res)=>{
    const {userId}=req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"invalid userId")
    }


    const playlist =await Playlist.find({
        owner:userId
    }).populate("owner","username fullName avatar")

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"user playlist is fetch successfully"))
})


const getPlayListById = asyncHandeler(async(req,res)=>{
    const {palylistId} = req.params


    if(!isValidObjectId(palylistId)){
        throw new ApiError(400,"invalid playlistId ")
    }

    //find playlist and populate video with their owners
    const playlist = await Playlist.findById(palylistId).populate({
        path:"video",
        populate:{
            path:"owner",
            select:"username fullName avatar" 
        }
    }).populate("owner", "username fullName avatar")


    if(!playlist){
        throw new ApiError(404, "playlist is not found")
    }
     
    return res.
    status(200)
    .json(new ApiResponse(200,playlist,"palylist featched successfully"))
})


 const addVideoToPlaylist = asyncHandeler(async(req,res)=>{
    const {palylistId, videoId }= req.paramms


    // validate Id
    if(!isValidObjectId(palylistId) || isValidObjectId(videoId)){
        throw new ApiError(400,"invalid playlist or videoId")
    }

    //find playlist and ownership
    const playlist = await Playlist.findById(palylistId)

    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you can not authorized persion")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    //check video is already in playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"video already exist in playlist")
    }

    //add video to playlist
    playlist.videos.push(videoId)
    await playlist.save()


    //Fetch update playlist with video  details
    const  newPlaylist =await Playlist.findById(palylistId)
    .populate({
        path:"videos",
        populate:{
            path:"owner",
            select:"username fullName avatar"
        }
    })

    return res
    .status(200)
    .json(200,newPlaylist,"video added to playlist successfully")
 })





const removeVideoFromplaylist =asyncHandeler(async(req,res)=>{
    const{videoId , palylistId} =req.params

    if(isValidObjectId(videoId) || isValidObjectId(palylistId)){
        throw new ApiError(400, "invalid video or playlistId")
    }


    const playlist = await Playlist.findById(palylistId)


    if(!playlist){
        throw new ApiError(404,"playlist is not found")
    }


    //only owner remove your 
     if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you can olny remove video from you own playlist")
     }

     if(!playlist.video.includes(videoId)){
        throw new ApiError(404,"video is not exists in playlist")
     }

     playlist.video.filter(
        id => id.toString() !== videoId 
     )
     await playlist.save()


     //fetch update playlist

     const updatePlaylist = await Playlist.findById(palylistId)
     populate({
        path:"videos",
        populate:{
            path:"owner",
            select:"username fullName avatar"
        }
     })

     return res
     .status(200)
     .json(new ApiResponse(200,updatePlaylist,"video remove from playlist successfully"))
})



const deletePlaylist =asyncHandeler(async(req,res)=>{
    const {palylistId}= req.params
 
if(!isValidObjectId(palylistId)){
    throw new ApiError(400,"invalid playlistId")
}

const playlist = await Playlist.findById(palylistId)

if(!playlist){
    throw new ApiError(404,"playlist not found")
}

if(playlist.owner.toString() !== req.user._id.toString()){
    throw new ApiError(400,"you can only delete your own playlist delete")
}

//delete playlist

await Playlist.findByIdAndDelete(palylistId)

return res
.status(200)
.json(new ApiResponse(200,{},"playlist delete successfully"))

})


const updatePlaylist = asyncHandeler(async(req,res)=>{
        const {palylistId} =req.paramms
        const {name ,description}= req.body


        if(!isValidObjectId(palylistId)){
            throw new ApiError(400,"invalid playlistId")
        }

        const playlist = await Playlist.findById(palylistId)

        if(!playlist){
            throw new ApiError(404,"playlist not found")
        }


        if (playlist.owner.toString() !== req.user._id.toString()) {
             throw new ApiError(403,"you can only update your own playlist")
        }

        const updateFilds ={}

        if(name) updateFilds.name = name.trim()
        if(description) updateFilds.description = description.trim()

        if(Object.keys(updateFilds).length === 0){
            throw new ApiError(400,"atlist one fild(name or description) is required")
        }

        const updatePlaylist = await Playlist.findByIdAndUpdate(palylistId,
            {
                $set:updateFilds
            },
            {
                new:true
            }
        ).populate("owner","username fullName avatar")


        return res
        .status(200)
        .json(new ApiResponse(200,updatePlaylist,"playlist update successfully"))
})







export{
    getUserPlayList,
    craetePlayList,
    getPlayListById,
    addVideoToPlaylist,
    deletePlaylist,
    removeVideoFromplaylist,
    updatePlaylist
}