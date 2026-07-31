import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "Admin") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({}, "-password");
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "Admin") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const { name, email, password, role } = await req.json();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role });
    
    return NextResponse.json({ message: "Pengguna berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
