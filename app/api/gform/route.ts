import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import connectDB from '@/lib/db';
import FormResponseStatus from '@/models/FormResponseStatus';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      console.error("Missing Google API credentials");
      return NextResponse.json({ error: 'Konfigurasi Google API belum lengkap di server.' }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const metaData = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const firstSheetName = metaData.data.sheets?.[0]?.properties?.title;

    if (!firstSheetName) {
      return NextResponse.json({ error: 'Tidak dapat menemukan Sheet.' }, { status: 500 });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${firstSheetName}!A:Z`,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const headers = rows[0];
    const rawData = rows.slice(1).map((row, index) => {
      const rowData: any = { _id: index.toString() };
      headers.forEach((header, i) => {
        rowData[header] = row[i] || "";
      });
      return rowData;
    });

    // Ambil data respon yang sudah diproses dari MongoDB
    let processedKeysSet = new Set<string>();
    try {
      await connectDB();
      const processedDocs = await FormResponseStatus.find({}, "responseKey");
      processedKeysSet = new Set(processedDocs.map(d => d.responseKey));
    } catch (dbError) {
      console.error("GForm DB status fetch error:", dbError);
    }

    // Filter hanya data yang BELUM diproses
    const data = rawData.filter((item) => {
      const timestamp = item["Timestamp"] || "";
      const nama = item["Nama Anak"] || item["Nama Lengkap"] || item["Nama"] || "";
      const key = `${timestamp}_${nama}`;
      return !processedKeysSet.has(key) && !processedKeysSet.has(item._id);
    });

    // Sort descending by Timestamp (terbaru di atas)
    data.reverse();

    return NextResponse.json({ headers, data });
  } catch (error: any) {
    console.error("GForm API Error:", error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat mengambil data.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "Admin" && session.role !== "Pengurus")) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const { responseKey, status, alasan } = await req.json();

    if (!responseKey || !status) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const result = await FormResponseStatus.findOneAndUpdate(
      { responseKey },
      { responseKey, status, alasan, processedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan", error: error.message }, { status: 500 });
  }
}
