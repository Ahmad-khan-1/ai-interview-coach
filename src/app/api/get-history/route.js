import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/lib/db";
import Interview from "@/app/lib/models/interview";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    await connectDB();

    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Get history error:", error.message);
    return NextResponse.json(
      { error: "Could not fetch history" },
      { status: 500 },
    );
  }
}
