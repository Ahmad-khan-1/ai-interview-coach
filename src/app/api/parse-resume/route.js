import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { chunkText } from "@/app/lib/chunking";
import { generateEmbeddings, generateEmbedding } from "@/app/lib/embeddings";
import { findRelevantChunks } from "@/app/lib/vectorStore";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;
const parseResumeRateLimit = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const key = `parse-resume:${userId}`;
  const existing = parseResumeRateLimit.get(key);

  if (!existing || now >= existing.resetAt) {
    parseResumeRateLimit.set(key, {
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File nahi mili" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Resume file is too large. Please upload a PDF under 5MB." },
        { status: 413 },
      );
    }

    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);
    const chunks = chunkText(data.text);

    // Terminal mein dekhne ke liye
    if (process.env.NODE_ENV === "development") {
      console.log(`Total chunks: ${chunks.length}`);
      chunks.forEach((chunk, i) => {
        console.log(`--- Chunk ${i + 1} ---`);
        console.log(chunk.slice(0, 100) + "..."); // pehle 100 characters
      });
    }

    // Embeddings generate karo (pehli baar model download hoga, thoda time lagega)
    const embeddings = await generateEmbeddings(chunks);
    if (process.env.NODE_ENV === "development") {
      console.log(`Total embeddings: ${embeddings.length}`);
      console.log(`Har embedding ki length: ${embeddings[0].length}`);
      console.log(
        `Pehla embedding (first 5 numbers):`,
        embeddings[0].slice(0, 5),
      );
    }

    // Test: similarity search check karte hain
    const testQuery = "What are the candidate's technical skills?";
    const queryEmbedding = await generateEmbedding(testQuery);
    const relevantChunks = findRelevantChunks(
      queryEmbedding,
      chunks,
      embeddings,
      2,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("--- Test Query ---", testQuery);
      console.log("--- Top Relevant Chunks ---");
      relevantChunks.forEach((c, i) =>
        console.log(`Match ${i + 1}:`, c.slice(0, 80)),
      );
    }

    return NextResponse.json({ text: data.text, chunks: chunks });
  } catch (error) {
    console.error("PDF parse error:", error.message);
    return NextResponse.json(
      { error: "PDF process nahi ho saka" },
      { status: 500 },
    );
  }
}
