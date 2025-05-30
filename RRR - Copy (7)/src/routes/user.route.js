import { Router } from "express";
import { refreshedAccessToken, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
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




export default router;