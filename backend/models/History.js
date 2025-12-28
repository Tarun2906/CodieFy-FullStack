import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    language: String,
    code: String,
    result: String
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
