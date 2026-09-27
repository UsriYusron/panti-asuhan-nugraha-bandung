import mongoose from "mongoose";

export interface IDonasi {
  _id?: string;
  no_kwitansi: string;
  tanggal: Date;
  tanggal_str?: string;
  nama_donatur: string;
  bentuk_donasi: string;
  rincian?: string;
  qty: number;
  satuan?: string;
  nominal: number;
  kanal?: string;
  alokasi?: string;
  batchId?: string;
  fileName?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DonasiSchema = new mongoose.Schema(
  {
    no_kwitansi: {
      type: String,
      trim: true,
      default: "",
    },
    tanggal: {
      type: Date,
      required: false,
    },
    tanggal_str: {
      type: String,
      default: "",
    },
    nama_donatur: {
      type: String,
      required: true,
      trim: true,
    },
    bentuk_donasi: {
      type: String,
      trim: true,
      default: "Uang",
    },
    rincian: {
      type: String,
      trim: true,
      default: "",
    },
    qty: {
      type: Number,
      default: 1,
    },
    satuan: {
      type: String,
      trim: true,
      default: "",
    },
    nominal: {
      type: Number,
      default: 0,
    },
    kanal: {
      type: String,
      trim: true,
      default: "",
    },
    alokasi: {
      type: String,
      trim: true,
      default: "",
    },
    batchId: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for fast searching and filtering
DonasiSchema.index({ nama_donatur: "text", no_kwitansi: "text", rincian: "text" });
DonasiSchema.index({ tanggal: -1 });
DonasiSchema.index({ createdAt: -1 });

export default mongoose.models.Donasi || mongoose.model("Donasi", DonasiSchema);
