"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, SortIndicator, TablePagination } from "@/components/ui/data-table-components";

export default function BeritaPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: "", konten: "", penulis: "", gambar: ""
  });

  const {
    searchTerm, setSearchTerm, sortConfig, handleSort,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["judul", "penulis"], 10);

  const fetchData = async () => {
    const res = await fetch("/api/berita");
    if (res.ok) setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formDataToSubmit = { ...formData };
    
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      if (uploadRes.ok) {
        const result = await uploadRes.json();
        formDataToSubmit.gambar = result.imageId;
      } else {
        alert("Gagal mengunggah gambar");
        return;
      }
    }

    const url = editingId ? `/api/berita/${editingId}` : "/api/berita";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(formDataToSubmit),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setIsOpen(false);
      setEditingId(null);
      setImageFile(null);
      setFormData({ judul: "", konten: "", penulis: "", gambar: "" });
      fetchData();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setImageFile(null);
    setFormData({
      judul: item.judul || "", 
      konten: item.konten || "", 
      penulis: item.penulis || "", 
      gambar: item.gambar || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Berita & Pengumuman</h1>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari judul atau penulis..." />
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setImageFile(null);
              setFormData({ judul: "", konten: "", penulis: "", gambar: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setImageFile(null);
                setFormData({ judul: "", konten: "", penulis: "", gambar: "" });
              }} className="mb-4"><Plus className="mr-2 h-4 w-4" /> Tambah Berita</Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Berita" : "Tambah Berita"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Berita</Label>
                <Input required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Konten / Isi Berita</Label>
                <Textarea required className="min-h-[150px]" value={formData.konten} onChange={e => setFormData({...formData, konten: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Penulis</Label>
                <Input required value={formData.penulis} onChange={e => setFormData({...formData, penulis: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Gambar Berita</Label>
                <Input type="file" accept="image/png, image/jpeg" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Gambar</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("judul")}>
                Judul <SortIndicator columnKey="judul" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("penulis")}>
                Penulis <SortIndicator columnKey="penulis" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("tanggalPublikasi")}>
                Tanggal Publikasi <SortIndicator columnKey="tanggalPublikasi" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell>
              </TableRow>
            ) : paginatedData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.gambar ? (
                    <img src={`/api/image/${item.gambar}`} alt={item.judul} className="w-10 h-10 object-cover rounded-md" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.judul}</TableCell>
                <TableCell>{item.penulis}</TableCell>
                <TableCell>{new Date(item.tanggalPublikasi).toLocaleDateString('id-ID')}</TableCell>
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
