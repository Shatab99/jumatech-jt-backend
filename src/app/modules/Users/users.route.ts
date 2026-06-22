import { Router } from "express";
import { UsersController } from "./users.controller";
import validateRequest from "../../middleware/validateRequest";
import { createUserSchema, updatePasswordSchema, updateUserSchema } from "./users.validation";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
import { createUploader } from "../../helper/uploadFile";
import auth from "../../middleware/auth";

const router = Router()

router.post("/create-user", createUploader([
    { name: "profileImage", maxCount: 1 }
]),
    parseBodyMiddleware,
    validateRequest(createUserSchema),
    UsersController.createUser);
router.get("/me", auth("USER"), UsersController.getMe);
router.put("/me", auth("USER"), createUploader([
    { name: "profileImage", maxCount: 1 }
]),
    parseBodyMiddleware,
    validateRequest(updateUserSchema),
    UsersController.updateMe);

router.put("/reset-pass", auth("USER"),
    validateRequest(updatePasswordSchema),
    UsersController.updatePassword);

export const userRouter = router