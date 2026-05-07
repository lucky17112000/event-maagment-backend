import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { appRouter } from "./app/routes/index";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/module/payment/payment.controller";
import cron from "node-cron";
import { ideaService } from "./app/module/idea/idea.services";
import { envVars } from "./app/config/env";
import cors from "cors";
// import AppError from "./app/errorHelper.ts/AppError";
// import status from "http-status";
import { globalErrorHandler } from "./app/midddlware/globalErrorHandler";
import { notFound } from "./app/midddlware/notFound";
import { auth } from "./app/lib/auth";
// import { authService } from "./app/module/auth/auth.service";
import { toNodeHandler } from "better-auth/node";
import path from "path";
import qs from "qs";

const app: Application = express();
// app.set("queries parser", (str: string) => qs.parse(str));
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.use(express.urlencoded({ extended: true }));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

/**!SECTION
 *
 *
 */
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());
app.use(cookieParser());

// Every 2 seconds (node-cron supports a 6-field format: second minute hour day month weekDay)
// cron.schedule("*/30 * * * *", async () => {
//   try {
//     console.log("Running cron job to update idea status...");
//     await ideaService.deleteByCornJobwhenSoftDeleted();
//   } catch (error) {
//     console.error("Error running cron job:", error);
//   }
// });

// // Every 2 minutes (node-cron supports a 6-field format: second minute hour day month weekDay)
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     console.log("Running cron job to delete unverified users...");
//     await authService.userDeleteByCornJobwhenEmailNotverifedafterCreatedwithin2Minutes();
//   } catch (error) {
//     console.error("Error running cron job:", error);
//   }
// });

app.use("/api/v1", appRouter);
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // throw new AppError(
  //   status.BAD_REQUEST,
  //   "This is a sample error from the root route",
  // );
  res.status(200).json({
    success: true,
    message: "Welcome to Eco spark API",
  });
});

//basic route

app.use(globalErrorHandler);
app.use(notFound);
export default app;
