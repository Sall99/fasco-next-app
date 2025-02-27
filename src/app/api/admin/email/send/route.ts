import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.to || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, or message" },
        { status: 400 },
      );
    }

    console.log("Email configuration:", {
      user: process.env.GMAIL_USER,
      hasAppPassword: !!process.env.GMAIL_APP_PASSWORD,
    });

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: body.to,
      subject: body.subject,
      text: body.message,
    });

    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email sending failed:", error);

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: (error as Error).message,
        stack:
          process.env.NODE_ENV === "development"
            ? (error as Error).stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
