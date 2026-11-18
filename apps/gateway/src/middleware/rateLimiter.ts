import type { Request, Response, NextFunction } from "express";

import { RateLimiterRedis } from "rate-limiter-flexible";

import redis from "../config/redis";

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "shopsphere_gateway",
  points: 100,
  duration: 60,
});

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const key = req.user?.id || req.ip || "unknown";

  try {
    const result = await rateLimiter.consume(key);

    res.setHeader("X-RateLimit-Remaining", result.remainingPoints);

    next();
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "msBeforeNext" in error &&
      typeof error.msBeforeNext === "number"
    ) {
      const retryAfter = Math.ceil(error.msBeforeNext / 1000);

      res.setHeader("Retry-After", retryAfter);

      res.status(429).json({
        success: false,
        message: "Too many requests. Try again later.",
      });

      return;
    }

    // Redis failure: fail closed.
    res.status(503).json({
      success: false,
      message: "Rate limiting service unavailable",
    });
  }
}
