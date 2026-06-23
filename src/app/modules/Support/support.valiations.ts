import z from "zod";

const sendReply = z.object({
    text: z.string()
});

const userMessage = z.object({
    text: z.string()
})


export const supportValidation = {
    sendReply,
    userMessage
}