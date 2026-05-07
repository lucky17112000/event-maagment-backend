import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { auth } from "../../lib/auth.js";
import { Role, USER_STATUS } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { tokenUtil } from "../../utiles/token.js";
// import { setTokenUtil } from "better-auth/oauth2";
import { envVars } from "../../config/env.js";
import { jwtUtils } from "../../utiles/jwt.js";
const registrationUser = async (payload) => {
    const { name, email, password, role } = payload;
    const normalizedRole = typeof role === "string" ? role.toUpperCase() : role;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            ...(normalizedRole === Role.ADMIN || normalizedRole === Role.USER
                ? { role: normalizedRole }
                : {}),
        },
    });
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }
    const accessToken = tokenUtil.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
    });
    const refreshToken = tokenUtil.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
    });
    return { ...data, accessToken, refreshToken };
};
const logInUser = async (payload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Invalid email or password");
    }
    if (data.user.status === USER_STATUS.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support for assistance.");
    }
    if (data.user.isDeleted) {
        throw new AppError(status.FORBIDDEN, "Your account has been deleted. Please contact support for assistance.");
    }
    //!todo access token and refresh token handling
    const accessToken = tokenUtil.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
    });
    const refreshToken = tokenUtil.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
    });
    return { ...data, accessToken, refreshToken };
};
const getMe = async (user) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            status: true,
            purchases: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!existingUser) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return existingUser;
};
const getNewToken = async (refreshToken, sessionToken) => {
    //exiting session token er time barate hobe new session token amader die make kora possible na karon session token ase better auth theke but amra time barai dite pari
    //manually session token getting proccess  change passsword e  better auth er away te access kora hoyece so duitai same kaj kore
    const isSessonTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        },
    });
    if (!isSessonTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "User is not logged in");
    }
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
    if (!verifiedRefreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }
    const data = verifiedRefreshToken.data;
    const newAccessToken = tokenUtil.getAccessToken({
        userId: data.id,
        role: data.role,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        status: data.status,
        isDeleted: data.isDeleted,
    });
    const newRefreshToken = tokenUtil.getRefreshToken({
        userId: data.id,
        role: data.role,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        status: data.status,
        isDeleted: data.isDeleted,
    });
    const updatedSession = await prisma.session.update({
        where: {
            token: sessionToken,
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), //! 1 days
            updatedAt: new Date(),
        },
    });
    //!SECTION end
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: updatedSession.token,
    };
};
const changePassword = async (payload, sessionToken) => {
    // const session  =
    const sesison = await auth.api.getSession({
        headers: {
            Authorization: `Bearer ${sessionToken}`,
        },
    });
    if (!sesison) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { currentPassword, newPassword } = payload;
    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
        },
        headers: {
            Authorization: `Bearer ${sessionToken}`,
        },
    });
    // return result;
    return { success: true, message: "Password changed successfully" };
};
const forgetPassword = async (email) => {
    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });
    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    if (!isUserExists.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email is not verified");
    }
    if (isUserExists.status === USER_STATUS.DELETED) {
        throw new AppError(status.BAD_REQUEST, "User is deleted");
    }
    await auth.api.requestPasswordResetEmailOTP({
        body: {
            email,
        },
    });
};
const verifyEmail = async (email, otp) => {
    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp,
        },
    });
    if (result.status && result.user.emailVerified) {
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true },
        });
    }
};
const userDeleteByCornJobwhenEmailNotverifedafterCreatedwithin2Minutes = async () => {
    await prisma.user.deleteMany({
        where: {
            emailVerified: false,
            createdAt: {
                lt: new Date(Date.now() - 2 * 60 * 1000), // Created more than 2 minutes ago
            },
        },
    });
    return { success: true, message: "Unverified users deleted successfully" };
};
//   const googleLoginSuccess = async (session: Record<string, any>) => {
//   const ispatientExist = await prisma.patient.findUnique({
//     where: {
//       userId: session.user.id,
//     },
//   });
//   if (!ispatientExist) {
//     await prisma.patient.create({
//       data: {
//         userId: session.user.id,
//         name: session.user.name,
//         email: session.user.email,
//       },
//     });
//   }
//   const accessToken = tokenUtiles.getAccessToken({
//     userId: session.user.id,
//     role: session.user.role,
//     name: session.user.name,
//   });
//   const refreshToken = tokenUtiles.getRefreshToken({
//     userId: session.user.id,
//     role: session.user.role,
//     name: session.user.name,
//   });
//   return {
//     accessToken,
//     refreshToken,
//   };
// };
const googleLoginSuccess = async (session) => {
    // if (!session?.user?.id || !session?.user?.email) {
    //   throw new AppError(status.UNAUTHORIZED, "Invalid session data");
    // }
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });
    if (!isUserExist) {
        await prisma.user.create({
            data: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
            },
        });
    }
    const accessToken = tokenUtil.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });
    const refreshToken = tokenUtil.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });
    return {
        accessToken,
        refreshToken,
    };
};
export const authService = {
    registrationUser,
    logInUser,
    getMe,
    changePassword,
    verifyEmail,
    userDeleteByCornJobwhenEmailNotverifedafterCreatedwithin2Minutes,
    getNewToken,
    forgetPassword,
    googleLoginSuccess,
};
