import mongoose from "mongoose";

const SorotanSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    tagline: { type: String, required: true },
    deskripsi: { type: String, required: true },
    gambar: { type: String, required: true },
    bgColor: { type: String, default: "from-[#84cc16]/20 via-[#84cc16]/10 to-transparent" },
    accentColor: { type: String, default: "#84cc16" },
  },
  { timestamps: true }
);

if (mongoose.models.Sorotan) {
  delete mongoose.models.Sorotan;
}
export default mongoose.model("Sorotan", SorotanSchema);
