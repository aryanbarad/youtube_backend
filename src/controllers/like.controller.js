import mongoose , {isValidObjectId}from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const ToggeleVideoLike = asyncHandeler(async(req,res)=>{
const {videoId} = req.params
//validate videoId
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video")
    }
    const video = await Video.findById(videoId)

    //check if video is exist
    if(!video){
        throw new ApiError(404, "video is not exist")
    }


    const existingLike = await Like.findOne({
        video: videoId,
        likedBy:req.user?._id
    })


    if (existingLike) {
        //unlike: remove the like 
        await Like.findByIdAndDelete(existingLike._id)
        return res 
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"video unlike successfully"))
    } else {
        //Like:crate a new like
        const like = await Like.create({
            video:videoId,
            likedBy:req.user?._id
        }) 

        return res 
        .status(200)
        .json(new ApiResponse(200,{isLiked:true,like},"video liked successfully"))
    }
})

const ToggeleCommentLike = asyncHandeler(async(req,res)=>{
    const {commentId} = req.params
    //valiadate commentId
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invalid commentId")
    }

    //check if comment is exist
    const comment = await Comment.findById(commentId)


    if(!comment){
        throw new ApiError(404,"comment is not found ")
    }


    const existinglike = await Like.findOne({
        comment:commentId,
        likedBy:req.user?._id
    })

    if (existinglike) {
        //unlike: remove the like
        await Like.findByIdAndDelete(existinglike?._id)
        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"comment unliked succesfully"))
    } else {
        //like: create a new like 
        const like = await Like.create({

            comment:commentId,
            likedBy:req.user?._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:true,like},"comment like successfuly"))


    }
})



const ToggleTweetLike = asyncHandeler(async(req,res)=>{
    const {tweetId}= req.params
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"invalid tweetId")
    }

    //check if tweet exist 
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"tweet is not found")
    }


    const existingLike = await Like.findOne({
        tweet:tweetId,
        likedBy:req.user?._id
    })

    if(existingLike){
        //unlike: remove  the like 
        await Like.findByIdAndDelete(existingLike?._id)

        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"tweet unlike successfully"))
    }
    else{
        //like: create a new like

        const like= await Like.create({
            tweet:tweetId,
            likedBy:req.user?._id
        })

        return res 
        .status(200)
        .json(new ApiResponse(200,{isLiked:true, like},"tweet like successfully"))
 }

})

const getlikedvideo = asyncHandeler(async(req,res)=>{
    const like = await Like.find({
        likedBy:req.user?._id,
        video:{$exists:true}
    }).populate({
        path:"video",
        populate:{
            path:"owner",
            select:"username fullName avatar"
        }
    })



//filter out any null video (incase video is deleted)

const likeVideos = like
    .filter(like=> like.video !== null)
    .map(like => like.video)

return res
    .status(200)
    .json(new ApiResponse(200,likeVideos,"liked videos fetch successfully"))

})


export {
    getlikedvideo,
    ToggleTweetLike,
    ToggeleCommentLike,
    ToggeleVideoLike
}