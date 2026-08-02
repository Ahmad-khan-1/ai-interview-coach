import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return vec.map((v) => v / norm);
}

export async function generateEmbedding(text, taskType = "RETRIEVAL_DOCUMENT") {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { taskType, outputDimensionality: 768 },
  });
  return normalize(response.embeddings[0].values);
}

export async function generateEmbeddings(chunks) {
  const embeddings = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk, "RETRIEVAL_DOCUMENT");
    embeddings.push(embedding);
  }
  return embeddings;
}
