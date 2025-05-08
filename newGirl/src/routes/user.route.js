import { Router } from "express";
import { changeAccountDetails, changeAvatar, changeCoverImage, changePassword, currentUser, refreshedAccessToken, userChannelProfile, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( upload.fields([
    {name: 'avatar', maxCount:1},{name: 'coverImage', maxCount:1}
]) , userRegister)

// user login
router.route("/login").post(userLogin);

// user logout
router.route("/logout").post( verifyJWT, userLogout);

// end point
router.route("/refreshed-token").post( verifyJWT, refreshedAccessToken);

// get user data
router.route("/current-user-data").get( verifyJWT, currentUser);

// change password
router.route("/change-password").post( verifyJWT, changePassword);

//change account details
router.route("/change-details").patch( verifyJWT, changeAccountDetails);

// change avatar
router.route("/change-avatar").patch(verifyJWT,upload.fields([{name:'avatar', maxCount:1}]) , changeAvatar);

// change coverImage
router.route("/change-coverImage").patch( verifyJWT, upload.fields([{name: 'coverImage', maxCount:1}]) ,changeCoverImage);

// channel data
router.route("/channel/:userName").get(verifyJWT, userChannelProfile); 



export default router;