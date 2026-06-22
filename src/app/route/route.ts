import { Router } from "express"
import { userRouter } from "../modules/Users/users.route";
import { authRouter } from "../modules/Auth/auth.router";

const router = Router()

router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router 