import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Galeri from "@/models/Galeri";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    await connectDB();
    const galeri = await Galeri.findById(params.id);
    if (!galeri) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(galeri);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    
    await connectDB();
    const body = await req.json();
    const updatedGaleri = await Galeri.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedGaleri) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updatedGaleri);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    
    await connectDB();
    const deletedGaleri = await Galeri.findByIdAndDelete(params.id);
    if (!deletedGaleri) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
