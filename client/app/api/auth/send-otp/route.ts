import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json(); // type can be 'register' or 'forgot'

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (type === "register" && existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 400 }
      );
    }

    if (type === "forgot" && !existingUser) {
      return NextResponse.json(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to Database (Auto-deletes after 5 mins)
    await OTP.create({ email, otp });

    // Configure Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send Email
    await transporter.sendMail({
      from: `"MediAssist AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your MediAssist Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">MediAssist Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #333;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}