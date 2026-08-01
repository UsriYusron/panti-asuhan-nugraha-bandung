import { NextResponse } from 'next/server';
import { google } from 'googleapis';

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
    
    // Get the values from the first sheet
    // We can use 'Sheet1' or just generic range 'A1:Z1000' if we don't know the sheet name.
    // However, A:Z is safer to just get everything from the first visible sheet.
    // Or we can fetch sheet metadata first, but typically 'Form Responses 1' or 'Form Responses 1!A:Z' is used.
    // To make it dynamic and error-proof, we fetch metadata to get the first sheet's name.
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
    const data = rows.slice(1).map((row, index) => {
      const rowData: any = { _id: index.toString() };
      headers.forEach((header, i) => {
        rowData[header] = row[i] || "";
      });
      return rowData;
    });

    // Sort descending by Timestamp if it exists (usually the first column)
    data.reverse();

    return NextResponse.json({ headers, data });
  } catch (error: any) {
    console.error("GForm API Error:", error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat mengambil data.' }, { status: 500 });
  }
}
