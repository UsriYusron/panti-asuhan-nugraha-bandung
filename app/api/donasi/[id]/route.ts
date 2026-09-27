import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Donasi from "@/models/Donasi";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    let parsedTanggal: Date | null = null;
    let tanggal_str = "";
    if (body.tanggal) {
      parsedTanggal = new Date(body.tanggal);
      tanggal_str = body.tanggal.split("T")[0];
    }

    const updated = await Donasi.findByIdAndUpdate(
      id,
      {
        no_kwitansi: body.no_kwitansi || "",
        tanggal: parsedTanggal,
        tanggal_str,
        nama_donatur: body.nama_donatur,
        bentuk_donasi: body.bentuk_donasi || "Uang",
        rincian: body.rincian || "",
        qty: Number(body.qty) || 1,
        satuan: body.satuan || "",
        nominal: Number(body.nominal) || 0,
        kanal: body.kanal || "",
        alokasi: body.alokasi || "",
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Data donasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const deleted = await Donasi.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Data donasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Data donasi berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
