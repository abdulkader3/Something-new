import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";

const router = Router()


// Redirect router
router.route('/register').post(userRegister)

export default router;