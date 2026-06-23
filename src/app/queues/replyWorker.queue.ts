import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "../../config/redis.config";

export const replyQueue = new Queue("ai-reply-suggestions", {
    connection: redisConnection
})


export const replyQueueEvent = new QueueEvents("ai-reply-suggestions", {
    connection: redisConnection
})