import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInterviewQuestions(
  relevantResumeChunks,
  jobDescription,
) {
  const resumeContext = relevantResumeChunks.join("\n\n");

  const prompt = `You are an expert technical interviewer. Based on the candidate's resume information below and the job description, generate 5 personalized interview questions (mix of technical and behavioral).

RESUME INFORMATION:
${resumeContext}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a JSON array of questions, no extra text. Format:
["question 1", "question 2", "question 3", "question 4", "question 5"]`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const responseText = response.text;

  // Gemini kabhi kabhi ```json``` wrap kar deta hai, clean karo
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse failed, raw response:", responseText);
    throw new Error("AI response ko parse nahi kar saka");
  }
}

export async function generateFeedback(questions, answers, jobDescription) {
  const qaText = questions
    .map((q, i) => `Q${i + 1}: ${q}\nAnswer: ${answers[i]}`)
    .join("\n\n");

  const prompt = `You are an expert interview coach. Review the candidate's answers below for a role matching this job description.

JOB DESCRIPTION:
${jobDescription}

QUESTIONS AND ANSWERS:
${qaText}

For each answer, give brief, constructive feedback (2-3 sentences max). Then give an overall summary (strengths, areas to improve, and one actionable tip).

Return ONLY valid JSON in this exact format, no extra text:
{
  "perQuestionFeedback": ["feedback for Q1", "feedback for Q2", "feedback for Q3", "feedback for Q4", "feedback for Q5"],
  "overallSummary": {
    "strengths": "text here",
    "improvements": "text here",
    "actionableTip": "text here"
  }
}`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const cleaned = response.text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Feedback JSON parse failed, raw response:", response.text);
    throw new Error("Feedback response ko parse nahi kar saka");
  }
}
