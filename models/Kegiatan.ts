import mongoose from "mongoose";

const KegiatanSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: Date, required: true },
    waktu: { type: String, required: true }, // e.g. "09:00 - 12:00"
    lokasi: { type: String, required: true },
    pic: { type: String, required: true }, // Person in Charge
    status: { type: String, enum: ["Akan Datang", "Berlangsung", "Selesai"], default: "Akan Datang" },
  },
  { timestamps: true }
);

export default mongoose.models.Kegiatan || mongoose.model("Kegiatan", KegiatanSchema);
