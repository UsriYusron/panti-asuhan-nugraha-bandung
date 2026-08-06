"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, User, Calendar, Image as ImageIcon, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";

export default function BeritaPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: "", konten: "", penulis: "", gambar: ""
  });

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["judul", "penulis"], 9);

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Berita & Pengumuman</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} artikel dipublikasikan</p>
        </div>
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
              }}><Plus className="mr-2 h-4 w-4" /> Tambah Berita</Button>
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

      {/* Card Grid */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Newspaper className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Tidak ada berita</p>
          <p className="text-sm">Mulai tambahkan berita atau pengumuman</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedData.map((item) => (
            <div
              key={item._id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-muted">
                {item.gambar ? (
                  <img
                    src={`/api/image/${item.gambar}`}
                    alt={item.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                {/* Date badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.tanggalPublikasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">{item.judul}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{item.konten}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.penulis}</span>
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
          ))}
        </div>
      )}

      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
