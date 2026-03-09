import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/temp.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";




// getVideoComments - Get all comments for a specific video


//1. Validate videoId
// 2. Check if video exists
//3. Fetch comments with pagination
//4. Populate owner information
//5. Return paginated comments

const getAllVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const { videoId } = req.params
    // build match pipeline for filtering 
    const matchStage = {
        isPublished: true
    }

    // add userId filter if provideed
    if (userId && isValidObjectId(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }


    // add search query if provided (search in title and description)

    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    //build sort pipeline 

    const sortStage = {}
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === "asc" ? 1 : -1 // sort by specified field and order
    }
    else {
        sortStage.createdAt = -1  // default sort by creation date descending
    }


    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortStage
    }

    // aggredate pipeline to get videos with owner details 
    const videos = await Video.aggregatePaginate(
        Video.aggregate([
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                avatar: 1,
                                username: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: { $first: "$owner" }
                }
            },
            {
                $sort: sortStage
            }
        ]),
        options
    )

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "videos fetched successfully"))

})


const publishVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "title and description is required")
    }


    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailFileLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath || !thumbnailFileLocalPath) {
        throw new ApiError(400, "video file and thumbnail file are required")
    }

    //upload video file to cludinary

    const VideoFile = await uploadCloudinary(videoFileLocalPath)

    if (!VideoFile) {
        throw new ApiError(500, "failed to upload video file")
    }
    const thumbnailFile = await uploadCloudinary(thumbnailFileLocalPath)

    if (!thumbnailFile) {
        throw new ApiError(500, "failed to upload thumbnail file")
    }

    const duration = VideoFile.duration || 0

    const video = await Video.create({
        videoFile: VideoFile.url,
        thumbnail: thumbnailFile.url,
        title,
        description,
        duration,
        owner: req.user._id
    })

    const createdVideo = await Video.findById(video._id).populate("owner", "fullName avatar username")

    if (!createdVideo) {
        throw new ApiError(500, "failed to create video")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdVideo, "video published successfully"))

})






const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params



    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }


    const video = await Video.findById(videoId).populate("owner", "fullName avatar username")



    if (!video) {
        throw new ApiError(404, "video is not found")
    }



    video.views += 1
    await video.save()


    if (req.user) {
        await User.findByIdAndUpdate(req.user._id,
            {
                $addToSet: {
                    watchHistory: videoId
                }
            }
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "video fetched successfully"))


})





const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video is not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not authorized to access this video")
    }


    const updateFields = {}

    if (title) {
        updateFields.title = title
    }
    if (description) {
        updateFields.description = description
    }

    if (req.files?.thumbnail?.[0]?.path) {
        const thumbnailFile = await uploadCloudinary(req.files.thumbnail?.[0]?.path)

        if (!thumbnailFile) {
            throw new ApiError(500, "failed to upload thumbnail")
        }
        updateFields.thumbnail = thumbnailFile.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        }
        , {
            new: true
        }
    ).populate("owner", "username fullName avatar")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "video updated successfully"
            )
        )

})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video is not found ")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not authorized to access this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "video is successfully deleted"
        )
        )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video is not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not authorized to access this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            video,
            `video ${video.isPublished ? 'published' : 'unpublished'} successfully`
        )
        )




})






export {
    getAllVideo,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}