import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Kegiatan from "@/models/Kegiatan";

export async function GET() {
  try {
    await connectDB();
    const kegiatan = await Kegiatan.find({}).sort({ tanggal: 1 });
    return NextResponse.json(kegiatan);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newKegiatan = await Kegiatan.create(body);
    return NextResponse.json(newKegiatan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
