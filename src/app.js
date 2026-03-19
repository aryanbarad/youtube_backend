import express from "express"
import cookieParser from "cookie-parser"
import { swaggerUi, swaggerSpec } from "./utils/swagger.js"
import { errorHandler } from "./middleware/error.middleware.js"
import rateLimit from "express-rate-limit"
import cors from "cors"
 const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(limiter)
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(errorHandler)




import userRouter from "./routes/user.route.js"
import tweetRouter from "./routes/tweet.route.js"
import likeRouter from "./routes/like.route.js"
import playlist from "./routes/playlist.route.js"
import comment from "./routes/comment.route.js"
import videoRouter from "./routes/video.route.js"

app.use('/api/v1/users', userRouter )
app.use('/api/v1/tweets',tweetRouter)
app.use('/api/v1/likes',likeRouter)
app.use('/api/v1/playList',playlist)
app.use('/api/v1/comment',comment)
app.use('/api/v1/videos',videoRouter)


 export default app