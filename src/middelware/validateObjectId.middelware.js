import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";


const checkValidateObjectId = (id) => (req, res, next) => {
    const inValid = id.find(id => !mongoose.isValidObjectId(req.params[id]))


    if (inValid) {
        throw new ApiError(400, `invalid ${inValid}`)
    }


    next();



}

export {
    checkValidateObjectId
}





