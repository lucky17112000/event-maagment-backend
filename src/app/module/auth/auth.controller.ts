import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { auth } from "../../lib/auth";
import { tokenUtil } from "../../utiles/token";
import AppError from "../../errorHelper.ts/AppError";
import { envVars } from "../../config/env";

const registerUser = catchasync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registrationUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, refreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const verifyEmail = catchasync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const logInUser = catchasync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.logInUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, refreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  const result = await authService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
const getNewToken = catchasync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await authService.getNewToken(refreshToken, sessionToken);
  const {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken: newSessionToken,
  } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, newSessionToken);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New access token generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    },
  });
});

const changePassword = catchasync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  const payload = req.body;
  const result = await authService.changePassword(payload, sessionToken);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchasync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password reset OTP sent successfully",
    data: result,
  });
});

const handleOAuthError = catchasync(async (req: Request, res: Response) => {
  const error = (req.query.error as string) || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});

const googleLogin = catchasync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL: callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
});
// const googleLogin = catchasync(async (req: Request, res: Response) => {
//   const redirectPath = (req.query.redirect as string) || "/dashboard";
//   const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodeURIComponent(redirectPath)}`;

//   console.log("🔵 googleLogin called");
//   console.log("BETTER_AUTH_URL:", envVars.BETTER_AUTH_URL);
//   console.log("callbackURL:", callbackURL);

//   try {
//     const response = await fetch(
//       `${envVars.BETTER_AUTH_URL}/api/auth/sign-in/social`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ provider: "google", callbackURL }),
//       },
//     );

//     console.log("Better Auth response status:", response.status);
//     const data = await response.json();
//     console.log("Better Auth response data:", data);

//     const cookies =
//       typeof response.headers.getSetCookie === "function"
//         ? response.headers.getSetCookie()
//         : ([response.headers.get("set-cookie")].filter(Boolean) as string[]);

//     if (cookies.length > 0) {
//       res.setHeader("Set-Cookie", cookies);
//     }

//     if (data?.url) {
//       return res.redirect(data.url);
//     }

//     console.log("❌ No URL in response");
//     return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
//   } catch (error) {
//     console.error("❌ fetch to Better Auth failed:", error);
//     return res.redirect(`${envVars.FRONTEND_URL}/login?error=server_error`);
//   }
// });


const googleLoginSuccess = catchasync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }


    if(session && !session.user){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await authService.googleLoginSuccess(session);

    const {accessToken, refreshToken} = result;

    tokenUtil.setAccessTokenCookie(res, accessToken);
    tokenUtil.setRefreshTokenCookie(res, refreshToken);
 // ?redirect=//profile -> /profile
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";

    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
})

export const authController = {
  registerUser,
  verifyEmail,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
  forgetPassword,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
};
