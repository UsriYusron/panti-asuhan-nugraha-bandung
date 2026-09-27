// File: app/laporan-donasi/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num ?? 0);

const formatDate = (raw?: string, rawStr?: string) => {
  if (raw) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }
  }
  return rawStr || "-";
};

export default function LaporanDonasiPage() {
  const [data, setData] = useState<DonasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.append("search", search);
      if (startDate) qs.append("startDate", startDate);
      if (endDate) qs.append("endDate", endDate);
      const res = await fetch(`/api/donasi?${qs.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data ?? []);
      }
    } catch (e) {
      console.error("Error fetching donasi:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const resetFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchData();
  };

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const paginated = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navigation />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#AFFF00]">
          Laporan Donasi
        </h1>
        <p className="text-white/70 mb-10 text-lg max-w-3xl">
          Tabel donasi publik – pencarian nama / kwitansi dan filter periode.
        </p>

        {/* Filter Bar */}
        <section className="p-4 sm:p-6 bg-[#0D0D0D] border border-[#1F1F1F] rounded-t-2xl">
          <form onSubmit={handleFilter} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#919191]" />
                <Input
                  placeholder="Cari nama / kwitansi / rincian..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#141414] border-[#252525] text-xs text-white"
                />
              </div>
              {/* Date range */}
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#141414] border-[#252525] text-xs text-white"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#141414] border-[#252525] text-xs text-white"
              />
              {/* Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-[#919191] hover:text-white"
                  onClick={resetFilter}
                >
                  Reset
                </Button>
                <Button type="submit" className="bg-[#AFFF00] hover:bg-[#AFFF00]/90 text-black text-xs font-semibold">
                  <Filter className="h-3.5 w-3.5 mr-1" />Terapkan
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-[#919191] hover:text-white"
                  onClick={fetchData}
                  title="Segarkan"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </form>
        </section>

        {/* Table */}
        <section className="p-4 sm:p-6 bg-[#0D0D0D] border-x border-b border-[#1F1F1F] rounded-b-2xl">

        {loading ? (
          <div className="flex flex-col items-center py-20 text-[#919191] gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[#86efac]" />
            <span className="text-xs">Memuat data donasi…</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-[#919191]"><p className="text-sm">Tidak ada data donasi untuk kriteria ini.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] text-[#919191] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">No Kwitansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Donatur</th>
                  <th className="py-3 px-4">Bentuk</th>
                  <th className="py-3 px-4">Rincian</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Kanal</th>
                  <th className="py-3 px-4">Alokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818]">
                {paginated.map((item, i) => (
                  <tr key={item._id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 text-[#666] font-mono text-[11px]">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      {item.no_kwitansi || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#AAA]">
                      {formatDate(item.tanggal, item.tanggal_str)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.nama_donatur}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.bentuk_donasi?.toLowerCase().includes("barang")
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            : "bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/20"}
                        `}
                      >
                        {item.bentuk_donasi || "Uang"}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#BBB]">
                      {item.rincian || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-white">{item.qty || 1}</span>{" "}
                      <span className="text-[#888]">{item.satuan}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#86efac]">
                      {formatRupiah(item.nominal)}
                    </td>
                    <td className="py-3 px-4 text-[#AAA]">
                      {item.kanal || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#181818] text-[#DDD] px-2 py-0.5 rounded-md text-[11px]">
                        {item.alokasi || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-4 mt-4 border-t border-[#1F1F1F] flex items-center justify-between text-xs text-[#919191]">
            <span>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, data.length)} dari {data.length} donasi
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 bg-[#141414] border-[#252525] text-white disabled:opacity-30"
              >
                Sebelumnya
              </Button>
              <span className="px-2 py-1 bg-[#1A1A1A] rounded font-medium text-white">
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 bg-[#141414] border-[#252525] text-white disabled:opacity-30"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </section>
      </div>

      <Footer />
    </main>
  );
}
