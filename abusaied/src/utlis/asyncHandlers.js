const asyncHandlers = (reqHandlers)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandlers(req,res,next)).catch((error)=>(error))
    }
}

export {asyncHandlers};