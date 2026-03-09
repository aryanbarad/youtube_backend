import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subsciption.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/temp.js"



const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel Id")
    }


    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "you can't subcribe to your own channel")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "channel not found")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })


    if (existingSubscription) {
        //unsubscribe: remove subscripton    
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { isSubscribed: false },
                "unsubscribed from  channel successfully"
            )
            )

    }
    else {
        //subscribe:create new subscription
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isSubscribed: true, subscription },
                    "Subscribed to channel successfully"
                )
            )

    }


})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channelId")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "channel is not found")
    }

    const subscriber = await Subscription.aggregate([
        {
            $match:
            {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscriber"
                }
            }
        },
        {
            $project: {
                subscriber: 1,
                subscribedAt: "$createdAt"
            }
        },
        {
            $sort: {
                subscribedAt: -1 // most recent subscribers first
            }
        }

    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            subscriber,
            "subscriber fetch successfully"

        )
        )

})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params



    const userId =
        subscriberId && isValidObjectId(subscriberId)
            ? subscriberId
            : req.user._id.toString();

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel: {
                    $first: "$channel"
                }
            }
        },
        {
            $project: {
                channel: 1,
                subscribedAt: "$createdAt"
            }
        },
        {
            $sort: { subscribedAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedChannels,
                "subscribed channels fetched successfully"
            )
        )


})


export {
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels,
}