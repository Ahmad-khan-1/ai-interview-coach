// Do vectors ke beech cosine similarity calculate karta hai
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Query embedding ke hisaab se top-N sabse relevant chunks dhoondta hai
export function findRelevantChunks(
  queryEmbedding,
  chunks,
  chunkEmbeddings,
  topN = 3,
) {
  // Har chunk ka similarity score calculate karo
  const scored = chunks.map((chunk, i) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunkEmbeddings[i]),
  }));

  // Sabse zyada score wale upar layein
  scored.sort((a, b) => b.score - a.score);

  // Top N chunks wapas karo
  return scored.slice(0, topN).map((item) => item.chunk);
}
