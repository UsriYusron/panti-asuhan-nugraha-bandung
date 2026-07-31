import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Berita from "@/models/Berita";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const berita = await Berita.findById(params.id);
    if (!berita) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(berita);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedBerita = await Berita.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedBerita) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updatedBerita);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedBerita = await Berita.findByIdAndDelete(params.id);
    if (!deletedBerita) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
