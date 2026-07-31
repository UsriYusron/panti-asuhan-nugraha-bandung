import mongoose from "mongoose";

const AnakSchema = new mongoose.Schema(
  {
    namaLengkap: { type: String, required: true },
    tempatLahir: { type: String, required: true },
    tanggalLahir: { type: Date, required: true },
    jenisKelamin: { type: String, enum: ["Laki-laki", "Perempuan"], required: true },
    pendidikan: { type: String, required: true },
    alamatAsal: { type: String, required: true },
    namaWali: { type: String, required: true },
    kontakWali: { type: String, required: true },
    tanggalMasuk: { type: Date, default: Date.now },
    status: { type: String, enum: ["Aktif", "Lulus", "Keluar"], default: "Aktif" },
  },
  { timestamps: true }
);

export default mongoose.models.Anak || mongoose.model("Anak", AnakSchema);
