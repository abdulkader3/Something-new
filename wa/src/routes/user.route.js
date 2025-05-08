import { Router } from "express";
import { changeAccountDetails, changeAvatar, changeCoverImage, changePassword, getUserChannelProfile, TokenRenew, userData, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// register
router.route("/register").post( upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]) ,  userRegister);

// login
router.route("/login").post(userLogin);

// logout
router.route("/logout").post(verifyJWT, userLogout);

// end point
router.route("/renew-token").post(TokenRenew);

// current user data
router.route("/current-user-data").post(verifyJWT, userData);

// change password
router.route("/change-password").post(verifyJWT, changePassword);

// change current user account details
router.route("/change-details").post(verifyJWT, changeAccountDetails);

// change avatar
router.route("/change-avatar").post( upload.fields([{name: 'avatar', maxCount: 1}]), verifyJWT, changeAvatar);

// change coverImage
router.route("/change-coverImage").post( upload.fields([{name: 'coverImage', maxCount: 1}]), verifyJWT, changeCoverImage);

// get channel data
router.route("/channel-data").post(verifyJWT, getUserChannelProfile);



export default router;