import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.config';


const maintenanceQueue = new Queue('db-cleanup-queue', { connection: redisConnection });

export const initDailyCleanup = async () => {
    // 1. OBLITERATE the queue (Destroys all ghosts, waiting jobs, and history)
    await maintenanceQueue.obliterate({ force: true });// use this when you want to repeat the same job every day and want to ensure no duplicates or old jobs are lingering around. 
    console.log('[BullMQ] Queue completely wiped clean.');
    await maintenanceQueue.add(
        'daily-db-cleanup',
        {},
        {
            jobId: 'unique-daily-cleanup-id',
            repeat: { pattern: '0 0 * * *' },
            removeOnComplete: true,
        }
    );

    console.log('[BullMQ] Daily cleanup job scheduled cleanly.');
};