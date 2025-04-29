import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeAccountDetails, changePassword, getCurrentUser, refreshedAccessToken, updateAvatar, updateCoverImage, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()




router.route("/register").post( upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]), userRegister);

router.route("/login").post(userLogin);


router.route('/refreshed-access-token').post(refreshedAccessToken);

// secured router
router.route("/logout").post(verifyJWT, userLogout);

router.route("/get-current-user").post(verifyJWT, getCurrentUser);

router.route("/change-password").post(verifyJWT, changePassword);

router.route("/change-account-details").post(verifyJWT, changeAccountDetails);

router.route("/update-avatar").post(verifyJWT, upload.fields([{name: 'avatar', maxCount:1}]) , updateAvatar);

router.route("/update-coverImage").post(verifyJWT, upload.fields([{name: 'coverImage', maxCount:1}]) , updateCoverImage);



export default router;