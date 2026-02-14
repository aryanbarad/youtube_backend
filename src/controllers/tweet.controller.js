import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createTweet = asyncHandeler(async (req, res) => {
   const userId = req.user?._id;
   const { content } = req.body

   if (!content || content.trim() === "") {
      return new ApiResponse(400, "content is rerquired")
   }
   const newTweet = await Tweet.create(
      {
         owner: userId,
         content: content.trim()
      }
   )


   if (!newTweet) {
      throw new ApiResponse(500, "couldn't create tweet")
   }

   const populatedTweet = await newTweet.populate("owner", "name username profilePicture")

   return res
      .status(201)
      .json(new ApiResponse(201, populatedTweet, "tweet created successfully"))

})




const getUserTweets = asyncHandeler(async (req, res) => {
   const { userId } = req.params
   const { page = 1, limit = 10 } = req.query

   //console.log(req.query)
   const peginateTweet = Tweet.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId)
         }

      },
      {
         $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{
               $project: {
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
         $sort: {
            createdAt: -1
         }
      }

   ])


   const option = {
      page: parseInt(page),
      limit: parseInt(limit)
   }


   const paginatedTweets = await Tweet.aggregatePaginate(peginateTweet, option)

   return res
      .status(200)
      .json(new ApiResponse(200, paginatedTweets, "user tweets fetched successfully"))

})


const updateTweet = asyncHandeler(async (req, res) => {
   const { tweetId } = req.params
   const { content } = req.body
   const userId = req.user?._id

   if (!content || content.trim() === "") {
      throw new ApiResponse(400, "content is required")
   }

   const editwTeet = await Tweet.findOneAndUpdate(
      {
         _id: new mongoose.Types.ObjectId(tweetId),
         owner: new mongoose.Types.ObjectId(userId)


      },
      {
         $set: {
            content: content.trim()
         }
      },
      {
         new: true
      } )

      if(!editwTeet){
         throw new ApiResponse(404,"tweet not found or user not authorized to edit this tweet")
      }

      return res
      .status(200)
      .json(new ApiResponse(200, editwTeet,"tweet updated successfully"))

})









export {
   createTweet,
   getUserTweets,
   updateTweet
}