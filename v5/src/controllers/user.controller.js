import { asyncHandlers } from "../utils/asyncHandlers.js";

const userRegister = asyncHandlers(async (req,res)=>{
    res.status(200).json({
        message: 'OK its easy now'
    })
})
export{userRegister}