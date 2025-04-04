import { asyncHandlers } from "../utils/asyncHandlers.js";

const userRegister = asyncHandlers( async (res,req)=>{
    res.status(200).json({
        message: 'OK'
    })
})

export { userRegister }