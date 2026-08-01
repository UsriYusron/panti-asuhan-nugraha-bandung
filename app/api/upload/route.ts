import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ message: "Tidak ada file" }, { status: 400 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json({ message: "Database connection error" }, { status: 500 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    return new Promise((resolve) => {
      const uploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type,
      });
      
      uploadStream.end(buffer, () => {
        resolve(NextResponse.json({ imageId: uploadStream.id.toString() }, { status: 201 }));
      });
      
      uploadStream.on('error', (err) => {
        resolve(NextResponse.json({ message: "Gagal upload", error: err.message }, { status: 500 }));
      });
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
