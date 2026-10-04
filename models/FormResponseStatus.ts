import mongoose from "mongoose";

const FormResponseStatusSchema = new mongoose.Schema(
  {
    responseKey: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Terima", "Tolak"], required: true },
    alasan: { type: String },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

if (mongoose.models.FormResponseStatus) {
  delete mongoose.models.FormResponseStatus;
}

export default mongoose.model("FormResponseStatus", FormResponseStatusSchema);
