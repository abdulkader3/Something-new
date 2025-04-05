import { asyncHandlers } from "../utils/asyncHandlers.js";

const userRegister = asyncHandlers(async (req,res)=>{
    res.status(200).json({
        message: 'OK - Now Im getting hang of it'
    })
})

export{userRegister}