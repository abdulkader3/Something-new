const asyncHandlers = (reqHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next)).catch((error)=>(error))
    }
}
export{asyncHandlers}