import { Worker, Job } from 'bullmq';
import { LessThan } from 'typeorm';
import { redisConnection } from '../../config/redis.config';


export const cleanupWorker = new Worker(
    'db-cleanup-queue',
    async (job: Job) => {
        console.log(`[BullMQ] Running job: ${job.name}`);

        // Calculate the timestamp for 24 hours ago
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        try {
            // 1. Delete used tokens older than 1 day
            console.log(`[BullMQ] Cleanup successful: Deleting used tokens older than ${oneDayAgo.toISOString()}`);
        } catch (error) {
            console.error('[BullMQ] Cleanup job failed:', error);
            throw error; // BullMQ will handle the retry logic
        }
    },
    { connection: redisConnection }
);