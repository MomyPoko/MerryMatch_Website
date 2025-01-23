import mongoose, { Schema } from "mongoose";
import Package from "@/models/package";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    sexIdent: {
      type: String,
      require: false,
    },
    sexPref: {
      type: String,
      require: false,
    },
    racialPref: {
      type: String,
      require: false,
    },
    meeting: {
      type: String,
      require: false,
    },
    hobbies: {
      type: String,
      require: false,
    },
    image: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    matching: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "matched", "rejected"],
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    role: {
      type: String,
      required: false,
      default: "user",
    },
    packages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package", // connect collection 'Package'
      default: null, // ค่าเริ่มต้นคือ null (ยังไม่มี package)
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
