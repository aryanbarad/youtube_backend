import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" })
import app from "./app.js"

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3001, () => {
            console.log(`server is running on port : ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log('mongoDB connection is failed ', error)
    })
