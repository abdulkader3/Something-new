import { Router } from "express";
import { changeAvatar, changeCoverImage, changePassword, changeUserDetails, currentUser, refreshedAccessToken, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


// register
router.route("/register").post(upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]) , userRegister);

// login
router.route("/login").post(userLogin);

// logout
router.route("/logout").post(verifyJWT, userLogout);

// get current data
router.route("/current-user-data").post(verifyJWT, currentUser);

// end point
router.route("/refreshed-token").post(refreshedAccessToken);

// change password
router.route("/change-password").post( verifyJWT, changePassword);

// change user details
router.route("/change-user-details").post( verifyJWT, changeUserDetails);

//change avatar
router.route("/change-avatar").post( verifyJWT, upload.fields([{name: 'avatar', maxCount: 1}]) , changeAvatar);

// change coverImage
router.route("/change-coverImage").post(verifyJWT, upload.fields([{name: 'coverImage', maxCount: 1}]) , changeCoverImage)


export default router;