import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sorotan from "@/models/Sorotan";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    await connectDB();
    const sorotan = await Sorotan.findById(params.id);
    if (!sorotan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(sorotan);
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
    const updatedSorotan = await Sorotan.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedSorotan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updatedSorotan);
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
    const deletedSorotan = await Sorotan.findByIdAndDelete(params.id);
    if (!deletedSorotan) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
