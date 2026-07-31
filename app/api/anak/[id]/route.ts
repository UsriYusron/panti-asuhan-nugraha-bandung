import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Anak from "@/models/Anak";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const anak = await Anak.findById(params.id);
    if (!anak) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(anak);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedAnak = await Anak.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedAnak) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updatedAnak);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedAnak = await Anak.findByIdAndDelete(params.id);
    if (!deletedAnak) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
