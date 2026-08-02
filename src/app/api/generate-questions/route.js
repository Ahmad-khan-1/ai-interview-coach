import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { chunkText } from "@/app/lib/chunking";
import { generateEmbeddings, generateEmbedding } from "@/app/lib/embeddings";
import { findRelevantChunks } from "@/app/lib/vectorStore";
import { generateInterviewQuestions } from "@/app/lib/llm";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_JOB_DESCRIPTION_LENGTH = 5000;
const MAX_RESUME_TEXT_LENGTH = 50000;
const questionRateLimit = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const key = `generate-questions:${userId}`;
  const existing = questionRateLimit.get(key);

  if (!existing || now >= existing.resetAt) {
    questionRateLimit.set(key, {
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

    const { resumeText, jobDescription } = await request.json();

    if (typeof resumeText !== "string" || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "Resume text aur job description dono strings hone chahiye" },
        { status: 400 },
      );
    }

    const normalizedResumeText = resumeText.trim();
    const normalizedJobDescription = jobDescription.trim();

    if (!normalizedResumeText || !normalizedJobDescription) {
      return NextResponse.json(
        { error: "Resume text aur job description dono chahiye" },
        { status: 400 },
      );
    }

    if (normalizedResumeText.length > MAX_RESUME_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Resume text is too large. Please shorten it and try again." },
        { status: 413 },
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

    // Step 1: Resume ko chunks mein todo
    const chunks = chunkText(normalizedResumeText);

    // Step 2: Har chunk ka embedding banao
    const chunkEmbeddings = await generateEmbeddings(chunks);

    // Step 3: Job description ka embedding banao
    const jobEmbedding = await generateEmbedding(normalizedJobDescription);

    // Step 4: Job description se sabse relevant resume chunks dhoondo
    const relevantChunks = findRelevantChunks(
      jobEmbedding,
      chunks,
      chunkEmbeddings,
      4,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("--- Relevant Chunks Selected ---");
      relevantChunks.forEach((c, i) =>
        console.log(`${i + 1}:`, c.slice(0, 60)),
      );
    }

    // Step 5: Gemini se questions generate karo
    const questions = await generateInterviewQuestions(
      relevantChunks,
      normalizedJobDescription,
    );

    return NextResponse.json({ questions, relevantChunks });
  } catch (error) {
    console.error("Question generation error:", error.message);
    return NextResponse.json(
      { error: "Questions generate nahi ho sake" },
      { status: 500 },
    );
  }
}
