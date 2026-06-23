import { initCacheCleanupWorker } from "../workers/cleanupConvMsgs.worker";
import { initReplyWorker } from "../workers/replyWorker";



export const initBackgroundJobs = async () => {
    try {
        const schedulers = [
            initReplyWorker(),
            initCacheCleanupWorker()
        ];

        await Promise.all(schedulers);
        console.log("🚀 All background schedulers initialized successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize background jobs:", error);
    }
};