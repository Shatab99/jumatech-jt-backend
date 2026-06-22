import { z } from "zod";

const login = z.object({
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})



export const authValidation = {
    login
}