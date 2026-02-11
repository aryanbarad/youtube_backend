import { asyncHandeler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })



        return { accessToken, refreshToken }

    }
    catch (error) {
        throw new ApiError(500, "somthing went wrong while generating assess and refresh token")
    }

}



const registerUser = asyncHandeler(async (req, res, next) => {

    //1. req.body to fetch datax
    //2. validation - not empty
    //3. check if user already exists
    //4. check for coverImage and profileImage
    //5.upload to cloudinary, profileImage
    //6. create user object
    //7. remove password and refreshToken from user object
    //8.check for user creation success or faliure
    //9. return response




    const { fullName, email, username, password } = req.body
    //console.log("REQ BODY:", req.body)


    // if (fullName === "") {
    //     throw ApiError(400, "fullName is required")
    // }

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required ")
    }

    //User.findOne({email})

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })



    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists")
    }


    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // let avatarLocalPath;
    // if (req.files && Array.isArray(req.files.avatarLocalPath) && req.files.avatarLocalPath[0]) {
    //    avatarLocalPath = req.files.avatarLocalPath[0].path
    // }

    let coverImageLocalPath

    if (
        req.files && req.files.coverImage && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // console.log("FILES:", req.files);
    console.log("avatarLocalPath:", avatarLocalPath);
    console.log("coverImageLocalPath:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new ApiError(500, "somthing went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "user register succesfully")
    )

})


const loginUser = asyncHandeler(async (req, res) => {
    //req.body to featch data
    //validation - not empty
    //find username or email
    //password check
    //access and refresh token
    //send cookie

    const { email, password, username } = req.body

    if (!email && !username) {
        throw new ApiError(400, "username and email both are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password")

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPassword = await user.comparePassword(password)

    if (!isPassword) {
        throw new ApiError(401, "password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {

        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false
    }


    return res
        .status(200)
        .cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(
            new ApiResponse(200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "user logged in successfully"
            )
        )
})


const logoutUser = asyncHandeler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200,
                {},
                "user logged out successfully"
            )
        )
})


const refreshAccessToken = asyncHandeler(async (req, res) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new ApiError(401, "unauthorised request")
    }
    try {

        const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "invalid refresh Token")
        }

        if (incomingrefreshToken !== user?.refreshToken) {

            throw new ApiError(401, "refresh token is expired or used")
        }

        const option = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false
        }

        const { refreshToken: newrefreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)


        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", newrefreshToken, option)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newrefreshToken
                    },
                    "access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, "invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandeler(async (req, res) => {
    const { oldPassword, newPassword, conformPassword } = req.body

    if (newPassword !== conformPassword) {
        throw new ApiError(400, "new password and conform password does not equal")
    }

    const user = await User.findById(req.user?._id)

    const isOldPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isOldPasswordCorrect) {

        throw new ApiError(401, "old password is incorrect")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"))

})


const getCurrentUser = asyncHandeler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandeler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "fullname and email both are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                email: email.toLowerCase()
            },

        },
        { new: true }
    ).select("-password")


    return res
        .status(200)
        .json(new ApiResponse(200, user, "account details updated successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}