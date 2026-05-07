import nodemailer from "nodemailer";
import { envVars } from "../config/env.js";
import AppError from "../errorHelper.ts/AppError.js";
import status from "http-status";
const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_USER,
        pass: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PORT),
});
const renderOtpEmail = ({ name, otp, title, accentStart, accentEnd, label, description, expiry, warning, footerNote, }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 40px 0">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, ${accentStart} 0%, ${accentEnd} 100%); padding: 36px 40px; text-align: center;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.15); border-radius: 50%; padding: 12px 16px; margin-bottom: 12px;">
                  <span style="font-size: 32px">📩</span>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">PH Healthcare</h1>
                <p style="margin: 4px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">${title}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 40px 32px">
                <p style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1a1a2e;">Hello, ${name} 👋</p>
                <p style="margin: 0 0 28px; font-size: 15px; color: #5f6368; line-height: 1.6;">${description} This code is valid for <strong>${expiry}</strong>.</p>
                <div style="background: linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 100%); border: 2px dashed ${accentStart}; border-radius: 12px; padding: 28px 20px; text-align: center; margin-bottom: 28px;">
                  <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: ${accentStart}; letter-spacing: 2px; text-transform: uppercase;">${label}</p>
                  <div style="font-size: 42px; font-weight: 800; letter-spacing: 10px; color: ${accentEnd}; font-family: 'Courier New', monospace;">${otp}</div>
                </div>
                <div style="background: #fff8e1; border-left: 4px solid #f9a825; border-radius: 6px; padding: 14px 16px; margin-bottom: 28px;">
                  <p style="margin: 0; font-size: 13px; color: #5f4b02">⚠️ <strong>Never share this OTP</strong> with anyone. PH Healthcare will never ask for your code via phone or email.</p>
                </div>
                <p style="margin: 0; font-size: 14px; color: #9aa0a6;">${warning}</p>
              </td>
            </tr>
            <tr>
              <td style="background: #f8f9fa; border-top: 1px solid #e8eaed; padding: 20px 40px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #9aa0a6">© 2026 PH Healthcare. All rights reserved.</p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #9aa0a6">${footerNote}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
export const sendEmail = async ({ to, subject, templateName, templateData, attachments, }) => {
    try {
        const templateNameNormalized = templateName.trim();
        const html = templateNameNormalized === "otp"
            ? renderOtpEmail({
                name: String(templateData.name ?? "User"),
                otp: String(templateData.otp ?? ""),
                title: "Your OTP Code",
                accentStart: "#1a73e8",
                accentEnd: "#0d47a1",
                label: "Your OTP Code",
                description: "We received a request to verify your identity. Use the one-time password (OTP) below to continue.",
                expiry: "10 minutes",
                warning: "If you did not request this, please ignore this email or contact support immediately.",
                footerNote: "This is an automated message — please do not reply.",
            })
            : templateNameNormalized === "password-reset"
                ? renderOtpEmail({
                    name: String(templateData.name ?? "User"),
                    otp: String(templateData.otp ?? ""),
                    title: "Reset Your Password",
                    accentStart: "#d32f2f",
                    accentEnd: "#7b1fa2",
                    label: "Password Reset OTP",
                    description: "We received a request to reset your account password. Use the one-time password (OTP) below to proceed.",
                    expiry: "5 minutes",
                    warning: "If you did not request a password reset, please ignore this email or contact our support team immediately to secure your account.",
                    footerNote: "This is an automated message — please do not reply.",
                })
                : (() => {
                    throw new AppError(status.BAD_REQUEST, `Unknown email template: ${templateNameNormalized}`);
                })();
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(info, "Email sent successfully");
    }
    catch (error) {
        console.log("Error sending email", error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};
