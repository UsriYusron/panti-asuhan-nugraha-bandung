import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Donasi from "@/models/Donasi";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const bentuk = url.searchParams.get("bentuk") || "";
    const kanal = url.searchParams.get("kanal") || "";
    const alokasi = url.searchParams.get("alokasi") || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const query: any = {};

    if (search) {
      query.$or = [
        { nama_donatur: { $regex: search, $options: "i" } },
        { no_kwitansi: { $regex: search, $options: "i" } },
        { rincian: { $regex: search, $options: "i" } },
        { kanal: { $regex: search, $options: "i" } },
        { alokasi: { $regex: search, $options: "i" } },
      ];
    }

    if (bentuk && bentuk !== "Semua") {
      query.bentuk_donasi = { $regex: `^${bentuk}$`, $options: "i" };
    }

    if (kanal && kanal !== "Semua") {
      query.kanal = { $regex: `^${kanal}$`, $options: "i" };
    }

    if (alokasi && alokasi !== "Semua") {
      query.alokasi = { $regex: `^${alokasi}$`, $options: "i" };
    }

    if (startDate || endDate) {
      query.tanggal = {};
      if (startDate) {
        query.tanggal.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.tanggal.$lte = end;
      }
    }

    const donasi = await Donasi.find(query).sort({ tanggal: -1, createdAt: -1 });

    // Compute stats
    const totalTransactions = donasi.length;
    let totalNominal = 0;
    let totalBarang = 0;
    const uniqueDonatur = new Set<string>();

    donasi.forEach((item: any) => {
      totalNominal += item.nominal || 0;
      if (item.bentuk_donasi?.toLowerCase().includes("barang")) {
        totalBarang += item.qty || 1;
      }
      if (item.nama_donatur) {
        uniqueDonatur.add(item.nama_donatur.trim().toLowerCase());
      }
    });

    return NextResponse.json({
      data: donasi,
      stats: {
        totalTransactions,
        totalNominal,
        totalBarang,
        totalDonatur: uniqueDonatur.size,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
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

    if (!body.nama_donatur) {
      return NextResponse.json(
        { message: "Nama donatur wajib diisi" },
        { status: 400 }
      );
    }

    let parsedTanggal: Date | null = null;
    let tanggal_str = "";
    if (body.tanggal) {
      parsedTanggal = new Date(body.tanggal);
      tanggal_str = body.tanggal.split("T")[0];
    }

    const newDonasi = await Donasi.create({
      no_kwitansi: body.no_kwitansi || "",
      tanggal: parsedTanggal,
      tanggal_str,
      nama_donatur: body.nama_donatur,
      bentuk_donasi: body.bentuk_donasi || "Uang",
      rincian: body.rincian || "",
      qty: Number(body.qty) || 1,
      satuan: body.satuan || "",
      nominal: Number(body.nominal) || 0,
      kanal: body.kanal || "",
      alokasi: body.alokasi || "",
      createdBy: session.email || session.name || "Admin/Pengurus",
    });

    return NextResponse.json(newDonasi, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
