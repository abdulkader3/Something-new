import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, refreshedAccessToken, updateAccountDetails, updateAvatarFile, updateCoverImageFile, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()




router.route("/register").post( upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]), userRegister);

router.route("/login").post(userLogin);



// secured router
router.route("/logout").post(verifyJWT, userLogout);

router.route("/refreshed-token").post(refreshedAccessToken);

router.route("/change-password").post( verifyJWT, changeCurrentPassword);

router.route("/get-user-data").post( verifyJWT, getCurrentUser);

router.route("/update-account-details").post( verifyJWT, updateAccountDetails);

router.route("/update-avatar-file").post( verifyJWT, upload.fields([ {name: "avatar", maxCount: 1} ]), updateAvatarFile);

router.route("/update-coverImage-file").post( verifyJWT, upload.fields([ {name: "coverImage", maxCount: 1} ]), updateCoverImageFile);




export default router;