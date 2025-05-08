const asyncHandler = (ReqHandler)=>{
    return (req, res, next)=>{
        Promise.resolve(ReqHandler(req,res,next)).catch((error)=>(error))
    }
};
export{asyncHandler};