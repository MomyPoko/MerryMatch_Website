import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema({
  type_package: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  merry_limit: {
    type: Number,
    required: false,
  },
});

export default mongoose.models.Package ||
  mongoose.model("Package", packageSchema);
