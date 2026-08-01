import mongoose from "mongoose";

const BeritaSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    konten: { type: String, required: true },
    gambar: { type: String, default: "" },
    penulis: { type: String, required: true },
    tanggalPublikasi: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

if (mongoose.models.Berita) {
  delete mongoose.models.Berita;
}
export default mongoose.model("Berita", BeritaSchema);
