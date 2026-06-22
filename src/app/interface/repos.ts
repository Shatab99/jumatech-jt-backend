import { getRepo } from "../../utils/repo";
import { User } from "../entities/User";

export const userRepo = getRepo(User)