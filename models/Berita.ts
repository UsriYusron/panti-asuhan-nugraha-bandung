import mongoose from "mongoose";

const BeritaSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    konten: { type: String, required: true },
    gambarUrl: { type: String, default: "" },
    penulis: { type: String, required: true },
    tanggalPublikasi: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Berita || mongoose.model("Berita", BeritaSchema);
