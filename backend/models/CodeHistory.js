import mongoose from "mongoose";

const codeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    language: String,
    code: String,
    aiResponse: String
  },
  { timestamps: true }
);

export default mongoose.model("CodeHistory", codeHistorySchema);
