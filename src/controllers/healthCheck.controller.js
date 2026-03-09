import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/temp.js";

 const healthCheck = asyncHandeler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, 


        {   

            status:"ok",
            timestamps: new Date().toISOString(),
            uptime: process.uptime()
        },
            "server is healthy and runing "
    ))
})

  
  
export{
    healthCheck
}