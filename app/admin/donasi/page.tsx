"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
  Coins,
  Receipt,
  Users,
  Package,
  AlertCircle,
  CheckCircle2,
  Filter,
  X,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DonasiItem {
  _id: string;
  no_kwitansi: string;
  tanggal?: string;
  tanggal_str?: string;
  nama_donatur: string;
  bentuk_donasi: string;
  rincian?: string;
  qty: number;
  satuan?: string;
  nominal: number;
  kanal?: string;
  alokasi?: string;
  fileName?: string;
  batchId?: string;
  createdAt?: string;
}

interface StatsData {
  totalTransactions: number;
  totalNominal: number;
  totalBarang: number;
  totalDonatur: number;
}

export default function LaporanDonasiPage() {
  const [data, setData] = useState<DonasiItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalTransactions: 0,
    totalNominal: 0,
    totalBarang: 0,
    totalDonatur: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterBentuk, setFilterBentuk] = useState("Semua");
  const [filterKanal, setFilterKanal] = useState("Semua");
  const [filterAlokasi, setFilterAlokasi] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Import Dialog State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    totalImported?: number;
    totalNominal?: number;
    warnings?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form / Edit Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    no_kwitansi: "",
    tanggal: "",
    nama_donatur: "",
    bentuk_donasi: "Uang",
    rincian: "",
    qty: "1",
    satuan: "",
    nominal: "0",
    kanal: "Transfer BCA",
    alokasi: "Operasional",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterBentuk !== "Semua") params.append("bentuk", filterBentuk);
      if (filterKanal !== "Semua") params.append("kanal", filterKanal);
      if (filterAlokasi !== "Semua") params.append("alokasi", filterAlokasi);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/donasi?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error("Error fetching donasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setCurrentUser(resData.user);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleResetFilter = () => {
    setSearch("");
    setFilterBentuk("Semua");
    setFilterKanal("Semua");
    setFilterAlokasi("Semua");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setTimeout(() => fetchData(), 50);
  };

  // Import handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setImportResult(null);

    try {
      const body = new FormData();
      body.append("file", selectedFile);

      const res = await fetch("/api/donasi/import", {
        method: "POST",
        body,
      });

      const resJson = await res.json();
      if (res.ok) {
        setImportResult({
          success: true,
          message: resJson.message || "Import berhasil!",
          totalImported: resJson.totalImported,
          totalNominal: resJson.totalNominal,
          warnings: resJson.warnings,
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
      } else {
        setImportResult({
          success: false,
          message: resJson.message || "Gagal mengimpor file",
          warnings: resJson.errors,
        });
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: "Terjadi kesalahan koneksi saat mengunggah file.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add/Edit handler
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      no_kwitansi: "",
      tanggal: new Date().toISOString().split("T")[0],
      nama_donatur: "",
      bentuk_donasi: "Uang",
      rincian: "",
      qty: "1",
      satuan: "",
      nominal: "0",
      kanal: "Transfer BCA",
      alokasi: "Operasional",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: DonasiItem) => {
    setEditingId(item._id);
    let dateStr = "";
    if (item.tanggal) {
      dateStr = new Date(item.tanggal).toISOString().split("T")[0];
    } else if (item.tanggal_str) {
      dateStr = item.tanggal_str;
    }

    setFormData({
      no_kwitansi: item.no_kwitansi || "",
      tanggal: dateStr,
      nama_donatur: item.nama_donatur || "",
      bentuk_donasi: item.bentuk_donasi || "Uang",
      rincian: item.rincian || "",
      qty: String(item.qty || 1),
      satuan: item.satuan || "",
      nominal: String(item.nominal || 0),
      kanal: item.kanal || "Transfer BCA",
      alokasi: item.alokasi || "Operasional",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/donasi/${editingId}` : "/api/donasi";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal menyimpan data donasi");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus data donasi dari "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/donasi/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // Format Date
  const formatDate = (dateVal?: string, dateStrVal?: string) => {
    if (dateVal) {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
    return dateStrVal || "-";
  };

  // Pagination slice
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between p-6 bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[#86efac]">
            <Receipt className="h-5 w-5" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Admin & Pengurus
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Laporan Donasi
          </h1>
          <p className="text-sm text-[#919191]">
            Kelola dan impor pembukuan laporan donasi dari file Excel (.xlsx / .xls)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/donasi/template"
            download="Template_Laporan_Donasi.xlsx"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#181818] hover:bg-[#222222] text-[#E7E7E7] border border-[#2A2A2A] transition-colors"
          >
            <Download className="h-4 w-4 text-[#86efac]" />
            Unduh Template Excel
          </a>

          <Button
            onClick={() => {
              setImportResult(null);
              setSelectedFile(null);
              setIsImportOpen(true);
            }}
            className="bg-[#86efac] hover:bg-[#86efac]/90 text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Impor dari Excel
          </Button>

          <Button
            onClick={handleOpenAdd}
            variant="outline"
            className="border-[#2A2A2A] bg-[#141414] hover:bg-[#202020] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus className="h-4 w-4 text-[#86efac]" />
            Tambah Donasi
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Nominal Uang */}
        <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2 hover:border-[#86efac]/30 transition-colors">
          <div className="flex items-center justify-between text-[#919191]">
            <span className="text-xs font-semibold tracking-wider">
              TOTAL NOMINAL DONASI
            </span>
            <div className="p-2 rounded-lg bg-[#86efac]/10 text-[#86efac]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {formatRupiah(stats.totalNominal)}
          </div>
          <span className="text-xs text-[#86efac] font-medium">
            Akumulasi donasi dana
          </span>
        </div>

        {/* Total Transaksi */}
        <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2 hover:border-[#86efac]/30 transition-colors">
          <div className="flex items-center justify-between text-[#919191]">
            <span className="text-xs font-semibold tracking-wider">
              TOTAL TRANSAKSI
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {stats.totalTransactions}
          </div>
          <span className="text-xs text-blue-400 font-medium">
            Pencatatan kwitansi
          </span>
        </div>

        {/* Total Donatur Unik */}
        <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2 hover:border-[#86efac]/30 transition-colors">
          <div className="flex items-center justify-between text-[#919191]">
            <span className="text-xs font-semibold tracking-wider">
              DONATUR TERDATA
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {stats.totalDonatur}
          </div>
          <span className="text-xs text-purple-400 font-medium">
            Donatur perorangan & instansi
          </span>
        </div>

        {/* Donasi Barang */}
        <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2 hover:border-[#86efac]/30 transition-colors">
          <div className="flex items-center justify-between text-[#919191]">
            <span className="text-xs font-semibold tracking-wider">
              DONASI BARANG
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {stats.totalBarang}
          </div>
          <span className="text-xs text-amber-400 font-medium">
            Paket / unit barang logistik
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <form onSubmit={handleFilterSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#919191]" />
              <input
                type="text"
                placeholder="Cari donatur, kwitansi, rincian, alokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141414] border border-[#252525] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#86efac]/50"
              />
            </div>

            {/* Filter Bentuk Donasi */}
            <div>
              <select
                value={filterBentuk}
                onChange={(e) => setFilterBentuk(e.target.value)}
                className="w-full bg-[#141414] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86efac]/50"
              >
                <option value="Semua">Semua Bentuk Donasi</option>
                <option value="Uang">Uang</option>
                <option value="Barang">Barang</option>
                <option value="Makanan">Makanan</option>
                <option value="Jasa">Jasa</option>
              </select>
            </div>

            {/* Filter Kanal */}
            <div>
              <select
                value={filterKanal}
                onChange={(e) => setFilterKanal(e.target.value)}
                className="w-full bg-[#141414] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86efac]/50"
              >
                <option value="Semua">Semua Kanal</option>
                <option value="Transfer BCA">Transfer BCA</option>
                <option value="Transfer BRI">Transfer BRI</option>
                <option value="Transfer BSI">Transfer BSI</option>
                <option value="QRIS">QRIS</option>
                <option value="Tunai">Tunai / Langsung</option>
                <option value="Kotak Amal">Kotak Amal</option>
              </select>
            </div>

            {/* Filter Alokasi */}
            <div>
              <select
                value={filterAlokasi}
                onChange={(e) => setFilterAlokasi(e.target.value)}
                className="w-full bg-[#141414] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86efac]/50"
              >
                <option value="Semua">Semua Alokasi</option>
                <option value="Operasional">Operasional</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Logistik & Dapur">Logistik & Dapur</option>
                <option value="Santunan">Santunan</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1F1F1F]">
            {/* Date Range */}
            <div className="flex items-center gap-2 text-xs text-[#919191]">
              <span>Periode:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#141414] border border-[#252525] rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
              />
              <span>s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#141414] border border-[#252525] rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleResetFilter}
                variant="ghost"
                className="text-xs text-[#919191] hover:text-white px-3 py-1.5 h-auto"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white text-xs px-4 py-1.5 h-auto rounded-lg flex items-center gap-1.5"
              >
                <Filter className="h-3.5 w-3.5 text-[#86efac]" />
                Terapkan Filter
              </Button>
              <Button
                type="button"
                onClick={fetchData}
                variant="ghost"
                className="text-xs text-[#919191] hover:text-white p-2 h-auto"
                title="Segarkan data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">Daftar Laporan Donasi</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1F1F1F] text-[#86efac]">
              {data.length} Transaksi
            </span>
          </div>
          <span className="text-xs text-[#919191]">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#919191] gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[#86efac]" />
            <span className="text-xs">Memuat laporan donasi...</span>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <FileSpreadsheet className="h-12 w-12 text-[#333] mb-3" />
            <h3 className="text-base font-semibold text-white">Belum Ada Data Donasi</h3>
            <p className="text-xs text-[#919191] max-w-sm mt-1 mb-4">
              Silakan unggah berkas Excel laporan donasi atau tambahkan transaksi secara manual.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsImportOpen(true)}
                className="bg-[#86efac] text-black hover:bg-[#86efac]/90 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Unggah Excel
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] text-[#919191] border-b border-[#1F1F1F] uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-12">No</th>
                  <th className="py-3.5 px-4">No Kwitansi</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Nama Donatur</th>
                  <th className="py-3.5 px-4">Bentuk</th>
                  <th className="py-3.5 px-4">Rincian</th>
                  <th className="py-3.5 px-4">Qty</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Kanal</th>
                  <th className="py-3.5 px-4">Alokasi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#E7E7E7]">
                {paginatedData.map((item, index) => {
                  const rowNum = (currentPage - 1) * itemsPerPage + index + 1;
                  const isBarang =
                    item.bentuk_donasi?.toLowerCase().includes("barang") ||
                    item.bentuk_donasi?.toLowerCase().includes("makanan");

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-[#141414] transition-colors"
                    >
                      <td className="py-3 px-4 text-[#666] font-mono text-[11px]">
                        {rowNum}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-white whitespace-nowrap">
                        {item.no_kwitansi ? (
                          <span className="bg-[#181818] px-2 py-0.5 rounded border border-[#262626]">
                            {item.no_kwitansi}
                          </span>
                        ) : (
                          <span className="text-[#666]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#AAA]">
                        {formatDate(item.tanggal, item.tanggal_str)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {item.nama_donatur}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isBarang
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              : "bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/20"
                          }`}
                        >
                          {item.bentuk_donasi || "Uang"}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[#BBB]" title={item.rincian}>
                        {item.rincian || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-white">{item.qty || 1}</span>{" "}
                        <span className="text-[#888]">{item.satuan || ""}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap text-[#86efac]">
                        {item.nominal ? formatRupiah(item.nominal) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#AAA]">
                        {item.kanal || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-[#181818] text-[#DDD] px-2 py-0.5 rounded-md text-[11px]">
                          {item.alokasi || "Umum"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-[#919191] hover:text-[#86efac] hover:bg-[#1E1E1E] rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.nama_donatur)}
                            className="p-1.5 text-[#919191] hover:text-red-400 hover:bg-[#1E1E1E] rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1F1F1F] flex items-center justify-between text-xs text-[#919191]">
            <span>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data.length)} dari {data.length} donasi
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 text-xs bg-[#141414] border-[#252525] text-white disabled:opacity-30"
              >
                Sebelumnya
              </Button>
              <span className="px-2 py-1 bg-[#1A1A1A] rounded font-medium text-white text-xs">
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 text-xs bg-[#141414] border-[#252525] text-white disabled:opacity-30"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL IMPORT EXCEL */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-2xl bg-[#0D0D0D] border border-[#2A2A2A] text-white p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#86efac] mb-1">
              <FileSpreadsheet className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Unggah Berkas Excel
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Impor Laporan Donasi
            </DialogTitle>
            <DialogDescription className="text-xs text-[#919191]">
              Sistem akan membaca data mulai dari <strong>Baris 5 ke bawah</strong> sesuai format kolom di bawah ini.
            </DialogDescription>
          </DialogHeader>

          {/* Format Table Explanation */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-3.5 my-3">
            <span className="text-[11px] font-semibold text-[#86efac] uppercase tracking-wider block mb-2">
              Aturan Pemetaan Kolom (Mulai Baris 5):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">A5</span>: No Kwitansi
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">B5</span>: Tanggal
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">C5</span>: Nama Donatur
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">D5</span>: Bentuk Donasi
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">E5</span>: Rincian
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">F5</span>: Qty
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">G5</span>: Satuan
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">H5</span>: Nominal
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">I5</span>: Kanal
              </div>
              <div className="bg-[#1A1A1A] p-2 rounded border border-[#282828]">
                <span className="text-[#86efac] font-bold">J5</span>: Alokasi
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-[11px] text-[#919191]">
              <span>Gunakan file .xlsx atau .xls standar.</span>
              <a
                href="/api/donasi/template"
                download="Template_Laporan_Donasi.xlsx"
                className="text-[#86efac] hover:underline flex items-center gap-1 font-sans"
              >
                <Download className="h-3 w-3" /> Unduh Template Resmi
              </a>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#333] hover:border-[#86efac]/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#111]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="h-10 w-10 text-[#86efac] mb-2" />
              <p className="text-sm font-semibold text-white">
                {selectedFile ? selectedFile.name : "Klik untuk memilih file Excel"}
              </p>
              <p className="text-xs text-[#888] mt-1">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                  : "Mendukung format .xlsx dan .xls"}
              </p>
            </div>

            {/* Import Status / Feedback */}
            {importResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  importResult.success
                    ? "bg-[#86efac]/10 border-[#86efac]/30 text-[#86efac]"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {importResult.success ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{importResult.message}</div>
                  {importResult.totalImported !== undefined && (
                    <div className="mt-1 text-[#AAA]">
                      Jumlah Baris: <strong>{importResult.totalImported}</strong> |
                      Total Nominal: <strong>{formatRupiah(importResult.totalNominal || 0)}</strong>
                    </div>
                  )}
                  {importResult.warnings && importResult.warnings.length > 0 && (
                    <ul className="list-disc pl-4 mt-2 space-y-1 text-[#BBB]">
                      {importResult.warnings.slice(0, 5).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsImportOpen(false)}
                className="text-xs text-[#919191] hover:text-white"
              >
                Tutup
              </Button>
              <Button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="bg-[#86efac] hover:bg-[#86efac]/90 text-black font-semibold text-xs px-5 rounded-xl"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" /> Masukkan ke Database
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL TAMBAH / EDIT DONASI */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl bg-[#0D0D0D] border border-[#2A2A2A] text-white p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingId ? "Edit Laporan Donasi" : "Tambah Laporan Donasi Manual"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#919191]">
              Input data donatur dan rincian penerimaan donasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">No Kwitansi</Label>
                <Input
                  value={formData.no_kwitansi}
                  onChange={(e) =>
                    setFormData({ ...formData, no_kwitansi: e.target.value })
                  }
                  placeholder="Contoh: KW-2024/001"
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Tanggal</Label>
                <Input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs text-[#AAA]">
                  Nama Donatur <span className="text-red-400">*</span>
                </Label>
                <Input
                  required
                  value={formData.nama_donatur}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_donatur: e.target.value })
                  }
                  placeholder="Nama Donatur atau Lembaga"
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Bentuk Donasi</Label>
                <select
                  value={formData.bentuk_donasi}
                  onChange={(e) =>
                    setFormData({ ...formData, bentuk_donasi: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-[#252525] rounded-md px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Uang">Uang</option>
                  <option value="Barang">Barang</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Nominal (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                  placeholder="0"
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs text-[#AAA]">Rincian / Keterangan</Label>
                <Input
                  value={formData.rincian}
                  onChange={(e) =>
                    setFormData({ ...formData, rincian: e.target.value })
                  }
                  placeholder="Contoh: Sedekah harian, Beras Ramos 5kg, dll."
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Jumlah (Qty)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.qty}
                  onChange={(e) =>
                    setFormData({ ...formData, qty: e.target.value })
                  }
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Satuan</Label>
                <Input
                  value={formData.satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                  placeholder="Paket, Dus, Karung, Kg, Rim..."
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Kanal Penerimaan</Label>
                <Input
                  value={formData.kanal}
                  onChange={(e) =>
                    setFormData({ ...formData, kanal: e.target.value })
                  }
                  placeholder="Transfer BCA, Tunai, QRIS..."
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#AAA]">Alokasi</Label>
                <Input
                  value={formData.alokasi}
                  onChange={(e) =>
                    setFormData({ ...formData, alokasi: e.target.value })
                  }
                  placeholder="Operasional, Pendidikan, Santunan..."
                  className="bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1F1F1F]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#919191] hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#86efac] hover:bg-[#86efac]/90 text-black font-semibold text-xs px-5 rounded-xl"
              >
                {isSaving ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
