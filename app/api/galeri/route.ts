import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Galeri from "@/models/Galeri";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const galeri = await Galeri.find({}).sort({ createdAt: -1 });
    return NextResponse.json(galeri);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    
    await connectDB();
    const body = await req.json();
    const newGaleri = await Galeri.create(body);
    return NextResponse.json(newGaleri, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
