"use client";

import { useState, useEffect } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";
import { RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FormResponsesPage() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki",
    pendidikan: "",
    alamatAsal: "",
    namaWali: "",
    kontakWali: ""
  });
  
  const [rejectReason, setRejectReason] = useState("");
  const [rejectPhone, setRejectPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, headers, 10);

  // Fungsi util untuk menebak field
  const guessField = (item: any, keywords: string[]) => {
    if (!item) return "";
    for (const key of Object.keys(item)) {
      if (keywords.some(k => key.toLowerCase().includes(k))) {
        return item[key];
      }
    }
    return "";
  };

  const handleOpenAccept = (item: any) => {
    setSelectedItem(item);
    
    // Auto fill jika bisa tebak
    setFormData({
      namaLengkap: guessField(item, ["nama lengkap", "nama anak", "nama"]),
      tempatLahir: guessField(item, ["tempat lahir"]),
      tanggalLahir: guessField(item, ["tanggal lahir"]) || new Date().toISOString().split('T')[0],
      jenisKelamin: guessField(item, ["jenis kelamin", "kelamin"]).toLowerCase().includes("perempuan") ? "Perempuan" : "Laki-laki",
      pendidikan: guessField(item, ["pendidikan", "sekolah", "kelas"]),
      alamatAsal: guessField(item, ["alamat", "domisili"]),
      namaWali: guessField(item, ["nama wali", "orang tua", "bapak", "ibu", "wali"]),
      kontakWali: guessField(item, ["wa", "whatsapp", "telepon", "hp", "nomor"])
    });
    
    setIsAcceptOpen(true);
  };

  const handleOpenReject = (item: any) => {
    setSelectedItem(item);
    let phone = guessField(item, ["wa", "whatsapp", "telepon", "hp", "nomor"]);
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    setRejectPhone(phone);
    setRejectReason("");
    setIsRejectOpen(true);
  };

  const handleAcceptSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/anak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Data anak berhasil ditambahkan!");
        setIsAcceptOpen(false);
      } else {
        const errData = await res.json();
        alert("Gagal: " + (errData.message || errData.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectPhone) {
      alert("Nomor WhatsApp tidak ditemukan.");
      return;
    }
    const templateMsg = `Mohon maaf, pengajuan pendaftaran panti asuhan atas nama ${guessField(selectedItem, ["nama lengkap", "nama anak", "nama"])} tidak dapat kami terima.\n\nAlasan: ${rejectReason}\n\nTerima kasih atas pengertiannya.`;
    const waUrl = `https://wa.me/${rejectPhone}?text=${encodeURIComponent(templateMsg)}`;
    window.open(waUrl, '_blank');
    setIsRejectOpen(false);
  };

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
              <div key={index} className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6 shadow-sm hover:border-[#86efac]/30 transition-colors flex flex-col h-full relative group">
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
                
                <div className="flex flex-col gap-5 flex-grow mb-6">
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

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-[#1F1F1F]">
                  <Button onClick={() => handleOpenAccept(item)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terima
                  </Button>
                  <Button onClick={() => handleOpenReject(item)} variant="destructive" className="w-full">
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak
                  </Button>
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

      {/* Modal Terima */}
      <Dialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Terima Anak Asuh</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nama Lengkap</Label>
              <Input className="col-span-3" value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tempat Lahir</Label>
              <Input className="col-span-3" value={formData.tempatLahir} onChange={e => setFormData({...formData, tempatLahir: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tanggal Lahir</Label>
              <Input type="date" className="col-span-3" value={formData.tanggalLahir} onChange={e => setFormData({...formData, tanggalLahir: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Jenis Kelamin</Label>
              <Select value={formData.jenisKelamin} onValueChange={val => setFormData({...formData, jenisKelamin: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Pendidikan</Label>
              <Input className="col-span-3" value={formData.pendidikan} onChange={e => setFormData({...formData, pendidikan: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Alamat Asal</Label>
              <Input className="col-span-3" value={formData.alamatAsal} onChange={e => setFormData({...formData, alamatAsal: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nama Wali</Label>
              <Input className="col-span-3" value={formData.namaWali} onChange={e => setFormData({...formData, namaWali: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">No WA Wali</Label>
              <Input className="col-span-3" value={formData.kontakWali} onChange={e => setFormData({...formData, kontakWali: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAcceptOpen(false)}>Batal</Button>
            <Button onClick={handleAcceptSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan ke Data Anak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tolak */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tolak Pendaftaran</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nomor WhatsApp Tujuan</Label>
              <Input value={rejectPhone} onChange={e => setRejectPhone(e.target.value)} placeholder="Misal: 62812345678" />
            </div>
            <div className="grid gap-2">
              <Label>Alasan Penolakan</Label>
              <Textarea 
                placeholder="Masukkan alasan penolakan..." 
                value={rejectReason} 
                onChange={e => setRejectReason(e.target.value)} 
                rows={4} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Batal</Button>
            <Button onClick={handleRejectSubmit} variant="destructive">Kirim WhatsApp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
