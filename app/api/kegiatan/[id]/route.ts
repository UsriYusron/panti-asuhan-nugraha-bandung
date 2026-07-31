import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Kegiatan from "@/models/Kegiatan";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const kegiatan = await Kegiatan.findById(params.id);
    if (!kegiatan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(kegiatan);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedKegiatan = await Kegiatan.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedKegiatan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updatedKegiatan);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedKegiatan = await Kegiatan.findByIdAndDelete(params.id);
    if (!deletedKegiatan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
