import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const checkValidateObjectId = asyncHandler(async(req,res,next)=>{
   
   
   
    const inValid = id.find(id => !mongoose.isValidObjectId(req.params[id]))


    if (inValid) {
        throw new ApiError(400, `invalid ${inValid}`)
    }


    next();
})





