import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Prediction from "@/models/Prediction";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    // 1. Call Flask API
    const flaskResponse = await fetch("http://localhost:5000/api/predict/parkinsons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(errorData, { status: flaskResponse.status });
    }

    const result = await flaskResponse.json();

    // 2. Save to DB if user is logged in
    if (session && session.user?.email) {
      await dbConnect();
      await Prediction.create({
        userEmail: session.user.email,
        disease: "parkinsons",
        inputData: body,
        result: {
          prediction: result.prediction.disease_detected ? "Positive" : "Negative",
          probability: result.prediction.probability,
          risk_level: result.risk_assessment.level,
          message: result.risk_assessment.message,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Parkinsons Prediction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
