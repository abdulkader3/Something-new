import   jwt       from  "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

export const verifyJWT = asyncHandlers ( async (req, _, next )=>{
    try {
        const token = req.cookies?.refreshToken || req.header("Authorization")?.replace('Bearer ','');
        if(!token){
            throw new ApiErrors(401, 'unauthorized request')
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiErrors(401, 'token expired')
        }

        req.user = user;
        next()


    } catch (error) {
        throw new ApiErrors(401, error?.message ,'Invalid refresh token')
    }
} );