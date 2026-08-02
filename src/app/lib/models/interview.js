import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    perQuestionFeedback: {
      type: [String],
      required: true,
    },
    overallSummary: {
      strengths: String,
      improvements: String,
      actionableTip: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Interview ||
  mongoose.model("Interview", InterviewSchema);
