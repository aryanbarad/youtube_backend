import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandeler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";




const getVideoComments = asyncHandeler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id ")
    }


    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    const PaginateComments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                ownerDetails: { $first: "$videoDetails.ownnerDetails" }
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]

            },
        },
        {
            $addFields: {
                ownerDetails: { $first: "$ownerDetails" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }

    ])

    const option = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const paginatedComment = Comment.aggregatePaginate(PaginateComments)

    return res
        .status(200)
        .json(new ApiResponse(200, paginatedComment, "user comment  fetch successfully  "))
})



const addComment = asyncHandeler(async (res, req) => {
    const { videoId } = req.params
    const { content } = req.body
    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "invalid videoId")
    }
    const video = await Video.findById(videoId)

    if (!video) {
        throw ApiError(404, "video is not found")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "comment content is required")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    const createComment = await Comment.findById(comment._id).populate("owner", "username fullName avatar")


    return res
        .status(201)
        .json(new ApiResponse(201, createComment, "comment added successfully"))
})


const updateComment = asyncHandeler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "comment is not found")
    }

    //check if user is owner 
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can only update you own comments ")
    }

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "commnet content is required")
    }

    const updateComment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    ).populate("owner","username fullName avatar")


    return res
    .status(200)
    .json(new ApiResponse(200,updateComment,"comment update successfully"))

})


const deleteComment = asyncHandeler(async(req,res)=>{
    const {commentId}= req.params
 
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"invalid commentId")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404,"comment not found ")
    }

    //check if the user is owner
    if(comment.owner.toString() !== res.user._id.toString()){
        throw new ApiError(403,"you can only delete your own comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(200,{},"comment is successfully delete ")



})


export {
    getVideoComments,
    addComment,
    updateComment
}