import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Donasi from "@/models/Donasi";
import { getSession } from "@/lib/auth";
import { parseDonasiExcelBuffer } from "@/lib/excel-donasi";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json(
        { message: "Akses ditolak. Fitur ini hanya untuk Admin dan Pengurus." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File Excel tidak ditemukan. Harap unggah file .xlsx atau .xls" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel starting from Row 5 (index 4)
    const parseResult = parseDonasiExcelBuffer(buffer);

    if (!parseResult.success || parseResult.validRows.length === 0) {
      return NextResponse.json(
        {
          message: "Tidak ada data donasi yang valid ditemukan mulai dari baris 5.",
          errors: parseResult.errors.length > 0 ? parseResult.errors : [
            "Pastikan data dimulai dari baris 5 (A5 = No Kwitansi, B5 = Tanggal, C5 = Nama Donatur, D5 = Bentuk Donasi, E5 = Rincian, F5 = Qty, G5 = Satuan, H5 = Nominal, I5 = Kanal, J5 = Alokasi)"
          ],
        },
        { status: 400 }
      );
    }

    await connectDB();

    const batchId = `import-${Date.now()}`;
    const userIdentifier = session.name || session.email || "Admin/Pengurus";

    const docsToInsert = parseResult.validRows.map((row) => ({
      no_kwitansi: row.no_kwitansi,
      tanggal: row.tanggal,
      tanggal_str: row.tanggal_str,
      nama_donatur: row.nama_donatur,
      bentuk_donasi: row.bentuk_donasi || "Uang",
      rincian: row.rincian || "",
      qty: row.qty || 1,
      satuan: row.satuan || "",
      nominal: row.nominal || 0,
      kanal: row.kanal || "",
      alokasi: row.alokasi || "",
      batchId,
      fileName,
      createdBy: userIdentifier,
    }));

    const inserted = await Donasi.insertMany(docsToInsert);

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${inserted.length} data donasi dari file ${fileName}.`,
      totalImported: inserted.length,
      totalNominal: parseResult.totalNominal,
      batchId,
      warnings: parseResult.errors,
      sample: inserted.slice(0, 5),
    });
  } catch (error: any) {
    console.error("Error importing excel:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat memproses file Excel.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
