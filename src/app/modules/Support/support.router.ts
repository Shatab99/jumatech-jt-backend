import { Router } from "express";
import auth from "../../middleware/auth";
import { supportController } from "./support.controller";
import validateRequest from "../../middleware/validateRequest";
import { supportValidation } from "./support.valiations";

const r = Router();

r.get("/get-conversations", auth("admin"), supportController.getAllConversations);

r.get("/get-conversation/:id", auth("admin"), supportController.getConversationById);

r.post("/:id/suggest-reply", auth("admin"), supportController.suggestReply);

r.post("/:id/send-reply", auth("admin"), validateRequest(supportValidation.sendReply), supportController.sendReply);

export const supportRouter = r;