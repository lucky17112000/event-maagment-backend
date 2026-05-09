import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextFunction, Request, Response } from "express";
const redis = Redis.fromEnv();

//difrent limiter for diffrent routes
const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});
//middlware to use the limiter

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // ইউজারের আইপি/আইডি বের করো – ভেরকেলে `x-forwarded-for` হেডার থেকে নাও
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "anonymous";
  console.log(`Rate limiting check for IP: ${ip}, Path: ${req.path}`);

  const { success, limit, remaining, reset } = await apiLimiter.limit(ip);

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", Math.floor(reset / 1000)); // Unix timestamp সেকেন্ডে
  if (!success) {
    return res.status(429).json({ error: "Too Many Requests" });
  }
  next();
}
