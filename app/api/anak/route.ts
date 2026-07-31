import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Anak from "@/models/Anak";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    
    const query = search ? { namaLengkap: { $regex: search, $options: "i" } } : {};
    const anak = await Anak.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(anak);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newAnak = await Anak.create(body);
    return NextResponse.json(newAnak, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
