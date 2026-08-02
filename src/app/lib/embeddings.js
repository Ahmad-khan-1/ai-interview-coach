import { pipeline, env } from "@xenova/transformers";

// Vercel serverless environment mein native ONNX bindings (.so files)
// kaam nahi karti, is liye WASM backend force karte hain (portable hai)
env.backends.onnx.wasm.numThreads = 1;
env.backends.setPriority(["wasm", "cpu"]);

// Model ko sirf ek baar load karenge (variable mein cache kar ke)
let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Ek text chunk ko embedding (numbers ki list) mein convert karta hai
export async function generateEmbedding(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // Float32Array ko normal array mein convert
}

// Multiple chunks ke liye embeddings ek sath banata hai
export async function generateEmbeddings(chunks) {
  const embeddings = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    embeddings.push(embedding);
  }
  return embeddings;
}
