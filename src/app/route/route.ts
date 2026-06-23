import { Router } from "express"
import { userRouter } from "../modules/Users/users.route";
import { authRouter } from "../modules/Auth/auth.router";
import { supportRouter } from "../modules/Support/support.router";

const router = Router()

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/support", supportRouter);

export default router 