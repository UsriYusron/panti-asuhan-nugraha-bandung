import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sorotan from "@/models/Sorotan";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const sorotan = await Sorotan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sorotan);
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

    const palettes = [
      { bgColor: "from-[#84cc16]/20 via-[#84cc16]/10 to-transparent", accentColor: "#84cc16" }, // Lime
      { bgColor: "from-[#f59e0b]/20 via-[#f59e0b]/10 to-transparent", accentColor: "#f59e0b" }, // Amber
      { bgColor: "from-[#AFFF00]/20 via-[#AFFF00]/5 to-transparent", accentColor: "#AFFF00" }, // Neon
      { bgColor: "from-[#3b82f6]/20 via-[#3b82f6]/10 to-transparent", accentColor: "#3b82f6" }, // Blue
      { bgColor: "from-[#a855f7]/20 via-[#a855f7]/10 to-transparent", accentColor: "#a855f7" }, // Purple
      { bgColor: "from-[#f43f5e]/20 via-[#f43f5e]/10 to-transparent", accentColor: "#f43f5e" }  // Rose
    ];

    if (!body.accentColor || !body.bgColor) {
      const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
      body.bgColor = randomPalette.bgColor;
      body.accentColor = randomPalette.accentColor;
    }

    const newSorotan = await Sorotan.create(body);
    return NextResponse.json(newSorotan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
