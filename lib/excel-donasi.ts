import * as XLSX from "xlsx";

export interface ParsedDonasiRow {
  rowNumber: number;
  no_kwitansi: string;
  tanggal: Date | null;
  tanggal_str: string;
  nama_donatur: string;
  bentuk_donasi: string;
  rincian: string;
  qty: number;
  satuan: string;
  nominal: number;
  kanal: string;
  alokasi: string;
}

export interface ParseResult {
  success: boolean;
  totalRows: number;
  validRows: ParsedDonasiRow[];
  errors: string[];
  totalNominal: number;
}

/**
 * Convert Excel date (serial number, Date, or string) to JavaScript Date
 */
export function parseExcelDate(val: any): { date: Date | null; str: string } {
  if (!val) return { date: null, str: "" };

  if (val instanceof Date && !isNaN(val.getTime())) {
    // Already a Date object
    const isoStr = val.toISOString().split("T")[0];
    return { date: val, str: isoStr };
  }

  if (typeof val === "number") {
    // Excel serial date to JS Date
    // Excel base date: Dec 30, 1899 (due to 1900 leap year bug in Lotus/Excel)
    try {
      const parsedDate = XLSX.SSF.parse_date_code(val);
      if (parsedDate) {
        const d = new Date(Date.UTC(parsedDate.y, parsedDate.m - 1, parsedDate.d));
        const yyyy = parsedDate.y;
        const mm = String(parsedDate.m).padStart(2, "0");
        const dd = String(parsedDate.d).padStart(2, "0");
        return { date: d, str: `${yyyy}-${mm}-${dd}` };
      }
    } catch {
      // Fallback calculation
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return { date, str: date.toISOString().split("T")[0] };
      }
    }
  }

  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return { date: null, str: "" };

    // Format DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const d = new Date(Date.UTC(year, month, day));
      if (!isNaN(d.getTime())) {
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return { date: d, str: `${year}-${mm}-${dd}` };
      }
    }

    // Format YYYY-MM-DD
    const ymdMatch = trimmed.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const d = new Date(Date.UTC(year, month, day));
      if (!isNaN(d.getTime())) {
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return { date: d, str: `${year}-${mm}-${dd}` };
      }
    }

    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return { date: d, str: d.toISOString().split("T")[0] };
    }

    return { date: null, str: trimmed };
  }

  return { date: null, str: String(val) };
}

/**
 * Parse nominal currency value to numeric
 */
export function parseNominal(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;

  const str = String(val).trim();
  // Remove "Rp", dots, spaces, commas
  // Check if standard Indonesian format e.g. "1.500.000" or "1500000"
  const clean = str.replace(/[^0-9,-]/g, "").replace(",", ".");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse Qty value
 */
export function parseQty(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 1 : val;
  if (!val) return 1;
  const num = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(num) || num <= 0 ? 1 : num;
}

/**
 * Parse Excel file buffer starting from Row 5 (index 4 in 0-based index)
 * A5 = no_kwitasi (col 0)
 * B5 = tanggal (col 1)
 * C5 = nama_donatur (col 2)
 * D5 = bentuk_donasi (col 3)
 * E5 = rincian (col 4)
 * F5 = qty (col 5)
 * G5 = satuan (col 6)
 * H5 = nominal (col 7)
 * I5 = kanal (col 8)
 * J5 = alokasi (col 9)
 */
export function parseDonasiExcelBuffer(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      success: false,
      totalRows: 0,
      validRows: [],
      errors: ["File Excel kosong atau tidak memiliki lembar kerja (sheet)."],
      totalNominal: 0,
    };
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet["!ref"]) {
    return {
      success: false,
      totalRows: 0,
      validRows: [],
      errors: ["Lembar kerja tidak memiliki data."],
      totalNominal: 0,
    };
  }

  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const validRows: ParsedDonasiRow[] = [];
  const errors: string[] = [];
  let totalNominal = 0;

  // Row 5 in Excel corresponds to 0-based row index r = 4
  const startRowIndex = 4;

  if (range.e.r < startRowIndex) {
    return {
      success: false,
      totalRows: 0,
      validRows: [],
      errors: ["File Excel memiliki kurang dari 5 baris data."],
      totalNominal: 0,
    };
  }

  // Iterate from Excel row 5 (r = 4) to end of sheet range
  for (let r = startRowIndex; r <= range.e.r; r++) {
    const excelRowNumber = r + 1; // 1-based row number for display

    const getCellValue = (c: number): any => {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellAddress];
      if (!cell) return "";
      return cell.v !== undefined ? cell.v : "";
    };

    // Columns:
    // A5 (c: 0) = no_kwitasi
    // B5 (c: 1) = tanggal
    // C5 (c: 2) = nama_donatur
    // D5 (c: 3) = bentuk_donasi
    // E5 (c: 4) = rincian
    // F5 (c: 5) = qty
    // G5 (c: 6) = satuan
    // H5 (c: 7) = nominal
    // I5 (c: 8) = kanal
    // J5 (c: 9) = alokasi
    const rawNoKwitansi = getCellValue(0);
    const rawTanggal = getCellValue(1);
    const rawNamaDonatur = getCellValue(2);
    const rawBentukDonasi = getCellValue(3);
    const rawRincian = getCellValue(4);
    const rawQty = getCellValue(5);
    const rawSatuan = getCellValue(6);
    const rawNominal = getCellValue(7);
    const rawKanal = getCellValue(8);
    const rawAlokasi = getCellValue(9);

    const no_kwitansi = rawNoKwitansi ? String(rawNoKwitansi).trim() : "";
    const nama_donatur = rawNamaDonatur ? String(rawNamaDonatur).trim() : "";
    const bentuk_donasi = rawBentukDonasi ? String(rawBentukDonasi).trim() : "Uang";
    const rincian = rawRincian ? String(rawRincian).trim() : "";
    const qty = parseQty(rawQty);
    const satuan = rawSatuan ? String(rawSatuan).trim() : "";
    const nominal = parseNominal(rawNominal);
    const kanal = rawKanal ? String(rawKanal).trim() : "";
    const alokasi = rawAlokasi ? String(rawAlokasi).trim() : "";

    // Check if the entire row is completely empty
    const isRowEmpty =
      !rawNoKwitansi &&
      !rawTanggal &&
      !rawNamaDonatur &&
      !rawBentukDonasi &&
      !rawRincian &&
      !rawQty &&
      !rawSatuan &&
      !rawNominal &&
      !rawKanal &&
      !rawAlokasi;

    if (isRowEmpty) continue;

    // If it's a summary/total row at the bottom (e.g., contains "TOTAL" or "JUMLAH" without donor name)
    const isSummaryRow =
      (!nama_donatur && nominal > 0) ||
      no_kwitansi.toLowerCase().includes("total") ||
      nama_donatur.toLowerCase().includes("total") ||
      nama_donatur.toLowerCase().includes("jumlah");

    if (isSummaryRow && !nama_donatur) {
      continue;
    }

    if (!nama_donatur) {
      errors.push(`Baris ${excelRowNumber}: Nama donatur kosong`);
      continue;
    }

    const { date, str: tanggal_str } = parseExcelDate(rawTanggal);

    validRows.push({
      rowNumber: excelRowNumber,
      no_kwitansi,
      tanggal: date,
      tanggal_str,
      nama_donatur,
      bentuk_donasi,
      rincian,
      qty,
      satuan,
      nominal,
      kanal,
      alokasi,
    });

    totalNominal += nominal;
  }

  return {
    success: validRows.length > 0,
    totalRows: validRows.length,
    validRows,
    errors,
    totalNominal,
  };
}
