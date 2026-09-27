import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    // Row 1: Title
    // Row 2: Note
    // Row 3: Blank
    // Row 4: Header
    // Row 5+: Data dimulai dari baris 5
    const data = [
      ["LAPORAN PENERIMAAN DONASI PSAA NUGRAHA BANDUNG"],
      ["Catatan: Pengisian data dimulai dari Baris 5 ke bawah sesuai format berikut."],
      [],
      [
        "No Kwitansi",
        "Tanggal",
        "Nama Donatur",
        "Bentuk Donasi",
        "Rincian",
        "Qty",
        "Satuan",
        "Nominal",
        "Kanal",
        "Alokasi",
      ],
      [
        "KW-2024/001",
        "2024-05-10",
        "Bapak Ahmad Fauzi",
        "Uang",
        "Donasi Rutin Bulanan",
        1,
        "Paket",
        500000,
        "Transfer BCA",
        "Operasional Panti",
      ],
      [
        "KW-2024/002",
        "2024-05-11",
        "Ibu Siti Rahma",
        "Barang",
        "Beras Ramos 5kg",
        10,
        "Karung",
        750000,
        "Tunai/Langsung",
        "Logistik & Dapur",
      ],
      [
        "KW-2024/003",
        "2024-05-12",
        "Hamba Allah",
        "Uang",
        "Sedekah Anak Yatim",
        1,
        "Paket",
        250000,
        "QRIS",
        "Pendidikan",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Column widths for easy reading
    ws["!cols"] = [
      { wch: 18 }, // A: No Kwitansi
      { wch: 14 }, // B: Tanggal
      { wch: 26 }, // C: Nama Donatur
      { wch: 16 }, // D: Bentuk Donasi
      { wch: 32 }, // E: Rincian
      { wch: 8 },  // F: Qty
      { wch: 12 }, // G: Satuan
      { wch: 18 }, // H: Nominal
      { wch: 18 }, // I: Kanal
      { wch: 22 }, // J: Alokasi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Donasi");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="Template_Laporan_Donasi.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
