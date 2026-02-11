import mongoose from "mongoose";



const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongoDB connected : ${connection.connection.host}  `)
    } catch (error) {
        console.log("somthing want wroeng", error)
    }
}
 
export default connectDB