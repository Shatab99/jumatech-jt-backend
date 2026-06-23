import { getRepo } from "../../utils/repo";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

export const userRepo = getRepo(User)
export const conRepo = getRepo(Conversation)
export const messageRepo = getRepo(Message)