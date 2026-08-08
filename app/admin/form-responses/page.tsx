"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, SortIndicator, TablePagination } from "@/components/ui/data-table-components";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormResponsesPage() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gform");
      const result = await res.json();
      
      if (res.ok) {
        setHeaders(result.headers || []);
        setData(result.data || []);
      } else {
        setError(result.error || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    searchTerm, setSearchTerm, sortConfig, handleSort,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, headers, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Respon Formulir</h1>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari data..." />
          <Button onClick={fetchData} variant="outline" disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </Button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12 text-muted-foreground">
              Memuat data...
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="col-span-full flex justify-center py-12 text-muted-foreground">
              Tidak ada data ditemukan.
            </div>
          ) : (
            paginatedData.map((item, index) => (
              <div key={index} className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6 shadow-sm hover:border-[#86efac]/30 transition-colors flex flex-col h-full">
                <div className="flex items-center justify-between mb-5 border-b border-[#1F1F1F] pb-4">
                  <span className="font-bold text-lg text-[#E7E7E7]">
                    Respon #{(currentPage - 1) * 10 + index + 1}
                  </span>
                  {item["Timestamp"] && (
                    <span className="text-[10px] text-[#919191] bg-[#1F1F1F] px-2 py-1 rounded-md font-medium tracking-wider">
                      {item["Timestamp"]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-5 flex-grow">
                  {headers.map((header) => {
                    if (header === "Timestamp") return null;
                    return (
                      <div key={header} className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-[#86efac] uppercase tracking-widest leading-relaxed">
                          {header}
                        </span>
                        <span className="text-sm font-medium text-[#E7E7E7] leading-relaxed break-words whitespace-pre-wrap">
                          {item[header] || "-"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
