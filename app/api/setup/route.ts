import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const existingAdmin = await User.findOne({ email: "psaanugraha@gmail.com" });
    
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin sudah ada." });
    }

    const hashedPassword = await bcrypt.hash("psaanugrahabandung", 10);

    const newAdmin = new User({
      name: "Administrator",
      email: "psaanugraha@gmail.com",
      password: hashedPassword,
      role: "Admin",
    });

    await newAdmin.save();

    return NextResponse.json({ message: "Admin berhasil dibuat." });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
