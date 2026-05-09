import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
const redis = Redis.fromEnv();
//difrent limiter for diffrent routes
const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "10 s"),
    analytics: true,
});
//middlware to use the limiter
export async function rateLimitMiddleware(req, res, next) {
    // ইউজারের আইপি/আইডি বের করো – ভেরকেলে `x-forwarded-for` হেডার থেকে নাও
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] ||
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
