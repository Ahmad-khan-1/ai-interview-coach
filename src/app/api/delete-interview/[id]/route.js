import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/lib/db";
import Interview from "@/app/lib/models/interview";

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const deletedInterview = await Interview.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedInterview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete interview error:", error.message);
    return NextResponse.json(
      { error: "Could not delete interview" },
      { status: 500 },
    );
  }
}
