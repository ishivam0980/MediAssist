import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Prediction from "@/models/Prediction";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    console.log("Fetching history for:", session.user.email);
    // Find predictions where userEmail matches the logged-in user's email
    // Sort by createdAt descending (newest first)
    const history = await Prediction.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 records
    
    console.log("Found records:", history.length);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
