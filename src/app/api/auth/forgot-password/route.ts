import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "../../../../../libs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (
  email: string,
  code: string,
  expiryTime: Date,
) => {
  const expiryTimeStr = expiryTime.toLocaleTimeString();
  const expiryDateStr = expiryTime.toLocaleDateString();

  const mailOptions = {
    from: `"FASCO Support" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your FASCO Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #333;">FASCO</h1>
        </div>
        <div style="padding: 20px; border-radius: 5px; border: 1px solid #eee;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Enter the confirmation code below to proceed:</p>
          <div style="background-color: #f5f5f5; padding: 12px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
            <strong>${code}</strong>
          </div>
          <p>This code will expire on ${expiryDateStr} at ${expiryTimeStr}.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} FASCO. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    console.log(email, "this is email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If your email is registered, you will receive a reset code shortly.",
        },
        { status: 200 },
      );
    }

    const confirmationCode = crypto.randomInt(100000, 999999).toString();

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: "password-reset",
        },
      },
      update: {
        token: confirmationCode,
        expires: expiryTime,
      },
      create: {
        identifier: email,
        token: confirmationCode,
        expires: expiryTime,
      },
    });

    await sendPasswordResetEmail(email, confirmationCode, expiryTime);

    return NextResponse.json(
      {
        message:
          "If your email is registered, you will receive a reset code shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
