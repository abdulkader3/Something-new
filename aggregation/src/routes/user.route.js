import { Router } from "express";
import { changeAccountDetails, changeAvatar, changeCoverImage, changePassword, currentUser, refreshedAccessToken, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
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
router.route("/current-user-data").post( verifyJWT, currentUser);

// change password
router.route("/change-password").post( verifyJWT, changePassword);

//change account details
router.route("/change-details").post( verifyJWT, changeAccountDetails);

// change avatar
router.route("/change-avatar").post(verifyJWT,upload.fields([{name:'avatar', maxCount:1}]) , changeAvatar);

router.route("/change-coverImage").post( verifyJWT, upload.fields([{name: 'coverImage', maxCount:1}]) ,changeCoverImage);

export default router;