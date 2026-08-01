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
    gambar: { type: String },
    status: { type: String, enum: ["Aktif", "Tidak Aktif", "Lulus", "Keluar"], default: "Aktif" },
  },
  { timestamps: true }
);

if (mongoose.models.Anak) {
  delete mongoose.models.Anak;
}
export default mongoose.model("Anak", AnakSchema);
