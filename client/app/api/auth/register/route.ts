import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    // --- 1. INPUT VALIDATION ---
    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Password Strength Check
    // Min 8 chars, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long and contain at least one letter and one number." },
        { status: 400 }
      );
    }
    // ---------------------------

    await connectDB();

    // 2. Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create User
    await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "email",
      isVerified: true,
    });

    // 6. Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ success: true, message: "Account created successfully" });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}