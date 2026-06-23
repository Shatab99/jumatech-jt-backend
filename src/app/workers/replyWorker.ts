import { Worker, Job } from "bullmq";
import { suggestReplyFromAI } from "../helper/suggestReply";
import client, { redisConnection } from "../../config/redis.config";

export const initReplyWorker = () => {
    const worker = new Worker(
        "ai-reply-suggestions",
        async (job: Job) => {
            const { conversationId, text } = job.data;
            console.log(`[Worker] Requesting OpenRouter suggestion for ticket ${conversationId}`);

            const suggestion = await suggestReplyFromAI(text);

            const cacheKey = `suggestion:${conversationId}`;
            await client.get(cacheKey);

            if (suggestion) await client.del(cacheKey);

            await client.set(cacheKey, suggestion, { EX: 60 * 60 * 24 });
            console.log(`[Worker] Suggestion cached in Redis for ticket ${conversationId}`);

            return { success: true, conversationId, suggestion };
        },
        {
            connection: redisConnection,
        });

    worker.on("completed", (job: Job) => {
        console.log(`[Worker] Job ${job.id} completed with result:`, job.returnvalue);
    });
};