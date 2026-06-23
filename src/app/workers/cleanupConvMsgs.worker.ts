import { Worker, Job } from "bullmq"; // Added Worker import
import client, { redisConnection } from "../../config/redis.config";

export const initCacheCleanupWorker = () => {
    const worker = new Worker("cache-cleanup",
        async (job: Job) => {
            const { conversationId } = job.data;
            console.log(`[Worker] Cleaning up cache for conversation ${conversationId}`);

            try {
                const pattern = `conversation:${conversationId}:*`;
                const keys = await client.keys(pattern);
                if (keys.length > 0) {
                    await client.del(keys);

                }

                console.log(`[Worker] Cache cleanup successful for conversation ${conversationId}`);
            }
            catch (error) {
                console.error(`[Worker] Cache cleanup failed for conversation ${conversationId}:`, error);
            }
        },
        {
            connection: redisConnection
        }
    );

    worker.on("completed", (job: Job) => {
        console.log(`[Worker] Cache cleanup conversation ID:  ${job.data.conversationId} completed successfully.`);
    })

};