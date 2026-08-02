import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/lib/db";
import Interview from "@/app/lib/models/interview";

const MAX_JOB_DESCRIPTION_LENGTH = 5000;
const MAX_QUESTION_COUNT = 10;
const MAX_TEXT_LENGTH = 20000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;
const saveInterviewRateLimit = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const key = `save-interview:${userId}`;
  const existing = saveInterviewRateLimit.get(key);

  if (!existing || now >= existing.resetAt) {
    saveInterviewRateLimit.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false };
  }

  existing.count += 1;
  return { allowed: true };
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests, please wait a few minutes and try again.",
        },
        { status: 429 },
      );
    }

    const {
      jobDescription,
      questions,
      answers,
      perQuestionFeedback,
      overallSummary,
    } = await request.json();

    if (
      typeof jobDescription !== "string" ||
      !Array.isArray(questions) ||
      !Array.isArray(answers)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const normalizedJobDescription = jobDescription.trim();

    if (
      !normalizedJobDescription ||
      questions.length === 0 ||
      answers.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (normalizedJobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: "Job description is too long." },
        { status: 413 },
      );
    }

    if (
      questions.length > MAX_QUESTION_COUNT ||
      answers.length > MAX_QUESTION_COUNT
    ) {
      return NextResponse.json(
        { error: "Too many questions or answers provided." },
        { status: 413 },
      );
    }

    if (questions.length !== answers.length) {
      return NextResponse.json(
        { error: "Questions and answers must match in count." },
        { status: 400 },
      );
    }

    const hasInvalidItems =
      questions.some((q) => typeof q !== "string") ||
      answers.some((a) => typeof a !== "string") ||
      (Array.isArray(perQuestionFeedback) &&
        perQuestionFeedback.some((item) => typeof item !== "string"));

    if (hasInvalidItems) {
      return NextResponse.json(
        { error: "Interview content contains invalid values." },
        { status: 400 },
      );
    }

    const hasOversizedContent =
      questions.some((q) => q.length > MAX_TEXT_LENGTH) ||
      answers.some((a) => a.length > MAX_TEXT_LENGTH) ||
      (Array.isArray(perQuestionFeedback) &&
        perQuestionFeedback.some((item) => item.length > MAX_TEXT_LENGTH));

    if (hasOversizedContent) {
      return NextResponse.json(
        { error: "Interview content is too large." },
        { status: 413 },
      );
    }

    await connectDB();

    const interview = await Interview.create({
      userId,
      jobDescription: normalizedJobDescription,
      questions,
      answers,
      perQuestionFeedback,
      overallSummary,
    });

    return NextResponse.json({ success: true, id: interview._id });
  } catch (error) {
    console.error("Save interview error:", error.message);
    return NextResponse.json(
      { error: "Could not save interview" },
      { status: 500 },
    );
  }
}
