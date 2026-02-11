
const asyncHandeler = (requesHandel)=> async (req,res,next)=>{
   return Promise.resolve(requesHandel(req,res,next)).catch((error)=> next(error))
}






export {asyncHandeler}


// const asyncHandler = () => async (req,res,next )=>{
//  try {
//     await fn(req, res , next)
    
//  } catch (error) {
//     res.status(error.code || 500).json({
//         success: false,
//         message: error.message || "internal server error"
//     })
//  }

// }
