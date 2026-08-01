import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "ID Gambar tidak valid" }, { status: 400 });
    }

    await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ message: "Database connection error" }, { status: 500 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });

    const objectId = new mongoose.Types.ObjectId(params.id);

    // Check if file exists first
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return NextResponse.json({ message: "Gambar tidak ditemukan" }, { status: 404 });
    }

    const contentType = files[0].contentType || "image/jpeg";

    const downloadStream = bucket.openDownloadStream(objectId);

    // Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => controller.enqueue(chunk));
        downloadStream.on('end', () => controller.close());
        downloadStream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(webStream, {
      headers: { 
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
