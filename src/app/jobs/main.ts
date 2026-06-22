




export const initBackgroundJobs = async () => {
    try {
        // const schedulers = [
        //     //   initDailyCleanup(),
        // ];

        // await Promise.all(schedulers);
        console.log("🚀 All background schedulers initialized successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize background jobs:", error);
    }
};