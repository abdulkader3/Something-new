const asyncHandlers = (reqHandler)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next)).catch((err)=>(err))
    }
}
export{asyncHandlers}