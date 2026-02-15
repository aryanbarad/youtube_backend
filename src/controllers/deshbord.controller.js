import mongoose from "mongoose";
import { asyncHandeler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "..//models/subsciption.model.js"
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const getChannelState = asyncHandeler(async (req, res) => {

    const channelId = req.user._id

    const totalViewResult = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalView: { $sum: "$views" }
            }
        }
    ])

    //count  total subcribers 
    const totalSubcribers = await Subscription.countDocuments({
        channel: channelId
    })

    //count total video (published and unpublished)


    const totalVideo = await Video.countDocuments({
        owner: channelId
    })


    //get all video IDs for this channel

    const channelVideo = await Video.find({
        owner: channelId
    }).select("_id")


    const videosIds = channelId.map(video => video._id)

    //count total like on all videos

    const totalLike = await Like.countDocuments({
        video: { $in: videosIds }
    })


    //build stats object
    const stats = {
        totalViewResult: totalViewResult[0]?.totalView || 0,
        totalVideo,
        totalSubcribers,
        totalLike
    }

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "channel stats fetched successfully"))

})


const getChannelVideos = asyncHandeler(async (req, res) => {
    const channelId = req.user?._id

    // find all videos owned by the  channel

    const viodes = await Video.find({
        owner: channelId
    })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 }) // newst videos come first



    return res
    .status(200)
    .json(new ApiResponse(200, viodes, "channel videos successfully"))
})

export {
    getChannelState,
    getChannelVideos
}