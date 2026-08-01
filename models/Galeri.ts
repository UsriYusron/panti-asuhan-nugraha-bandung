import mongoose from "mongoose";

const GaleriSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    gambar: { type: String, required: true },
  },
  { timestamps: true }
);

const Galeri = mongoose.models.Galeri || mongoose.model("Galeri", GaleriSchema);
export default Galeri;
