import mongoose, { Schema } from "mongoose";
import User from "@/models/user";

const messageSchema = new Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
