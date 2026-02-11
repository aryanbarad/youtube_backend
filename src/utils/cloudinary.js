import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadCloudinary = async (localPath) => {
    try {
        if (!localPath) return null

        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath)
        }

        return response
    } catch (error) {
        if (localPath && fs.existsSync(localPath)) {
            fs.unlinkSync(localPath)
        }
        console.error("Cloudinary upload error:", error.message)
        return null
    }
}

export { uploadCloudinary }