import z from "zod";

const sendReply = z.object({
    text: z.string().max(200).min(2)
});


export const supportValidation = {
    sendReply
}