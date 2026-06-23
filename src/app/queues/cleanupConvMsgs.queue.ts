import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "../../config/redis.config";

export const cacheCleanUpQueue = new Queue("cache-cleanup", {
    connection: redisConnection
})

export const cacheCleanUpQueueEvent = new QueueEvents("cache-cleanup", {
    connection: redisConnection
})