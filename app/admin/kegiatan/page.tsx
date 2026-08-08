"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Calendar, Clock, MapPin, User, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";

export default function KegiatanPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "", deskripsi: "", tanggal: "", waktu: "", lokasi: "", pic: "", status: "Akan Datang"
  });

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["judul", "lokasi"], 9);

  const fetchData = async () => {
    const res = await fetch("/api/kegiatan");
    if (res.ok) setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/kegiatan/${editingId}` : "/api/kegiatan";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setIsOpen(false);
      setEditingId(null);
      setFormData({ judul: "", deskripsi: "", tanggal: "", waktu: "", lokasi: "", pic: "", status: "Akan Datang" });
      fetchData();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      judul: item.judul || "", 
      deskripsi: item.deskripsi || "", 
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : "", 
      waktu: item.waktu || "", 
      lokasi: item.lokasi || "", 
      pic: item.pic || "", 
      status: item.status || "Akan Datang"
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const res = await fetch(`/api/kegiatan/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  const statusConfig = (status: string) => {
    switch(status) {
      case "Berlangsung": return { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500" };
      case "Selesai":
      case "Sudah Berlalu": return { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", dot: "bg-gray-400" };
      default: return { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", dot: "bg-blue-500" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Kegiatan</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} kegiatan terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari kegiatan atau lokasi..." />
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({ judul: "", deskripsi: "", tanggal: "", waktu: "", lokasi: "", pic: "", status: "Akan Datang" });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({ judul: "", deskripsi: "", tanggal: "", waktu: "", lokasi: "", pic: "", status: "Akan Datang" });
              }}><Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan</Button>
            </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Kegiatan" : "Tambah Kegiatan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Kegiatan</Label>
                <Input required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input required value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input type="date" required value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Waktu (Mis. 09:00 - 12:00)</Label>
                  <Input required value={formData.waktu} onChange={e => setFormData({...formData, waktu: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input required value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Penanggung Jawab (PIC)</Label>
                <Input required value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} />
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Card Grid */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <CalendarDays className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Tidak ada kegiatan</p>
          <p className="text-sm">Tambahkan jadwal kegiatan baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedData.map((item) => {
            let currentStatus = item.status || "Akan Datang";
            if (item.tanggal) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const activityDate = new Date(item.tanggal);
              activityDate.setHours(0, 0, 0, 0);
              
              if (activityDate.getTime() < today.getTime()) {
                currentStatus = "Sudah Berlalu";
              } else if (activityDate.getTime() === today.getTime()) {
                currentStatus = "Berlangsung";
              } else {
                currentStatus = "Akan Datang";
              }
            }
            const sc = statusConfig(currentStatus);
            return (
              <div
                key={item._id}
                className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Date accent bar */}
                <div className="bg-primary/5 border-b px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Calendar className="h-4 w-4" />
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.color}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {currentStatus}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">{item.judul}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.deskripsi}</p>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.waktu || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">{item.lokasi || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span>PIC: {item.pic || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer — Actions */}
                <div className="flex border-t">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                  <div className="w-px bg-border" />
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
