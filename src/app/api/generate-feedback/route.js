import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateFeedback } from "@/app/lib/llm";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_JOB_DESCRIPTION_LENGTH = 5000;
const feedbackRateLimit = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const key = `generate-feedback:${userId}`;
  const existing = feedbackRateLimit.get(key);

  if (!existing || now >= existing.resetAt) {
    feedbackRateLimit.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterMs: existing.resetAt - now,
    };
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

    const { questions, answers, jobDescription } = await request.json();

    if (
      !Array.isArray(questions) ||
      !Array.isArray(answers) ||
      typeof jobDescription !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Questions, answers, aur job description ka format sahi hona chahiye",
        },
        { status: 400 },
      );
    }

    if (questions.length !== answers.length || questions.length === 0) {
      return NextResponse.json(
        { error: "Questions aur answers ka count match karna chahiye" },
        { status: 400 },
      );
    }

    const normalizedJobDescription = jobDescription.trim();

    if (!normalizedJobDescription) {
      return NextResponse.json(
        { error: "Job description zaroori hai" },
        { status: 400 },
      );
    }

    if (normalizedJobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          error:
            "Job description is too long. Please shorten it and try again.",
        },
        { status: 413 },
      );
    }

    const feedback = await generateFeedback(
      questions,
      answers,
      normalizedJobDescription,
    );

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Feedback generation error:", error.message);
    return NextResponse.json(
      { error: "Feedback generate nahi ho saka" },
      { status: 500 },
    );
  }
}
