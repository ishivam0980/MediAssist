"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Prediction from "@/models/Prediction";
import { handleError } from "@/lib/utils";

// Get user profile
export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  try {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// Update user profile
export async function updateUserProfile(updateData: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  try {
    await dbConnect();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser) throw new Error("User not found");
    revalidatePath("/profile");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// Get user prediction history
export async function getPredictionHistory() {
  const session = await auth();
  if (!session?.user?.email) return [];

  try {
    await dbConnect();
    const history = await Prediction.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(50);
    return JSON.parse(JSON.stringify(history));
  } catch (error) {
    handleError(error);
    return [];
  }
}

// Delete a prediction
export async function deletePrediction(predictionId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  try {
    await dbConnect();
    await Prediction.findOneAndDelete({
      _id: predictionId,
      userEmail: session.user.email, // Ensure user can only delete their own predictions
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}
