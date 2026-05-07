import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma";
import { Role, USER_STATUS } from "../../generated/prisma/enums";
import { bearer, emailOTP, oAuthProxy, openAPI } from "better-auth/plugins";
import { en, tr } from "zod/locales";
import { sendEmail } from "../utiles/email";
import { envVars } from "../config/env";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID!,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET!,
      // callbackUrl: envVars.GOOGLE_CALLBACK_URL!,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: USER_STATUS.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: USER_STATUS.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp", //for deployment
              // templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user) {
            await sendEmail({
              to: email,
              subject: "Reset your password",
              templateName: "password-reset",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
    },
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL!],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
  // advanced: {
  //   // useSecureCookies: false,
  //   cookies: {
  //     session_token: {
  //       name: "session_token", // Force this exact name
  //       attributes: {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "none",
  //         partitioned: true,
  //       },
  //     },
  //     state: {
  //       // name: "session_token", // Force this exact name
  //       name: "ba_state",
  //       attributes: {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "none",
  //         partitioned: true,
  //       },
  //     },
  //   },
  // },
  //  plugins: [oAuthProxy()],
});
