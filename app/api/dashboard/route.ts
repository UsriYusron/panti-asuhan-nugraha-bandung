import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Anak from "@/models/Anak";
import Kegiatan from "@/models/Kegiatan";
import Berita from "@/models/Berita";
import Donasi from "@/models/Donasi";

export async function GET() {
  try {
    await connectDB();
    
    const countAnak = await Anak.countDocuments();
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const countKegiatanBulanIni = await Kegiatan.countDocuments({
      tanggal: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    const countBerita = await Berita.countDocuments();
    
    const jadwalTerdekat = await Kegiatan.find({
      tanggal: { $gte: now }
    }).sort({ tanggal: 1 }).limit(3);

    const countDonasi = await Donasi.countDocuments();
    const donasiAgg = await Donasi.aggregate([
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);
    const totalDonasiNominal = donasiAgg[0]?.total || 0;

    return NextResponse.json({
      countAnak,
      countKegiatanBulanIni,
      countBerita,
      jadwalTerdekat,
      countDonasi,
      totalDonasiNominal,
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
