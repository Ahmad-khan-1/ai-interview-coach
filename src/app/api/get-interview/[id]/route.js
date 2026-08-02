import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/lib/db";
import Interview from "@/app/lib/models/interview";

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const interview = await Interview.findOne({ _id: id, userId }).lean();

    if (!interview) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Get interview error:", error.message);
    return NextResponse.json(
      { error: "Could not fetch interview" },
      { status: 500 },
    );
  }
}
