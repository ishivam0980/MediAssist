"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Prediction from "@/models/Prediction";
import { handleError } from "@/lib/utils";

export async function predictAndSave(
  disease: "diabetes" | "heart-disease" | "parkinsons",
  formData: any
) {
  const session = await auth();

  try {
    // 1. Call FastAPI Backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const flaskResponse = await fetch(`${API_URL}/api/predict/${disease}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      // Throw an error to be caught by the client
      throw new Error(errorData.detail || "Prediction failed");
    }

    const result = await flaskResponse.json();

    // 2. Save to DB if user is logged in
    if (session?.user?.email) {
      await dbConnect();
      await Prediction.create({
        userEmail: session.user.email,
        disease: disease,
        inputData: formData,
        result: {
          prediction: result.prediction.disease_detected ? "Positive" : "Negative",
          probability: result.prediction.probability,
          risk_level: result.risk_assessment.level,
          message: result.risk_assessment.message,
        },
      });
      // Revalidate the dashboard path to show the new prediction
      revalidatePath("/dashboard");
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}
