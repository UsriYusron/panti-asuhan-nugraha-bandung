"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, SortIndicator, TablePagination } from "@/components/ui/data-table-components";

export default function KegiatanPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "", deskripsi: "", tanggal: "", waktu: "", lokasi: "", pic: "", status: "Akan Datang"
  });

  const {
    searchTerm, setSearchTerm, sortConfig, handleSort,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["judul", "lokasi"], 10);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Jadwal Kegiatan</h1>
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
              }} className="mb-4"><Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan</Button>
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

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("judul")}>
                Judul <SortIndicator columnKey="judul" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("tanggal")}>
                Tanggal <SortIndicator columnKey="tanggal" sortConfig={sortConfig} />
              </TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("lokasi")}>
                Lokasi <SortIndicator columnKey="lokasi" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("pic")}>
                PIC <SortIndicator columnKey="pic" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                Status <SortIndicator columnKey="status" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell>
              </TableRow>
            ) : paginatedData.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.judul}</TableCell>
                <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{item.waktu}</TableCell>
                <TableCell>{item.lokasi}</TableCell>
                <TableCell>{item.pic}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
