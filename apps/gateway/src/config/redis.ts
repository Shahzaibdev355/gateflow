import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on("error", (error: Error) => {
  console.error("Redis connection error:", error);
  process.exit(1);
});

export default redis;
