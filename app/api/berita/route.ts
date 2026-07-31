import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Berita from "@/models/Berita";

export async function GET() {
  try {
    await connectDB();
    const berita = await Berita.find({}).sort({ tanggalPublikasi: -1 });
    return NextResponse.json(berita);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newBerita = await Berita.create(body);
    return NextResponse.json(newBerita, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
