import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
 const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())



import userRouter from "./routes/user.route.js"
import tweetRouter from "./routes/tweet.route.js"
import likeRouter from "./routes/like.route.js"
import playlist from "./routes/playlist.route.js"
import comment from "./routes/comment.route.js"

app.use('/api/users', userRouter )
app.use('/api/tweets',tweetRouter)
app.use('/api/likes',likeRouter)
app.use('/api/playList',playlist)
app.use('/api/comment',comment)


 export default app