"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Image as ImageIcon, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";

export default function SorotanPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: "", tagline: "", deskripsi: "", gambar: "", 
    bgColor: "", 
    accentColor: ""
  });

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["judul", "tagline"], 9);

  const fetchData = async () => {
    const res = await fetch("/api/sorotan");
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

    const url = editingId ? `/api/sorotan/${editingId}` : "/api/sorotan";
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
      setFormData({ 
        judul: "", tagline: "", deskripsi: "", gambar: "", 
        bgColor: "", 
        accentColor: "" 
      });
      fetchData();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setImageFile(null);
    setFormData({
      judul: item.judul || "", 
      tagline: item.tagline || "", 
      deskripsi: item.deskripsi || "", 
      gambar: item.gambar || "",
      bgColor: item.bgColor || "",
      accentColor: item.accentColor || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const res = await fetch(`/api/sorotan/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sorotan Utama (Carousel)</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} slide aktif</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari judul atau tagline..." />
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setImageFile(null);
              setFormData({ 
                judul: "", tagline: "", deskripsi: "", gambar: "", 
                bgColor: "", 
                accentColor: "" 
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setImageFile(null);
                setFormData({ 
                  judul: "", tagline: "", deskripsi: "", gambar: "", 
                  bgColor: "", 
                  accentColor: "" 
                });
              }}><Plus className="mr-2 h-4 w-4" /> Tambah Sorotan</Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Sorotan" : "Tambah Sorotan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Sorotan</Label>
                <Input required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Tagline (Kategori)</Label>
                <Input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea required className="min-h-[100px]" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Gambar (Background)</Label>
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
          <Layers className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Tidak ada slide sorotan</p>
          <p className="text-sm">Tambahkan slide pertama untuk carousel</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedData.map((item, idx) => (
            <div
              key={item._id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Thumbnail with overlay */}
              <div className="relative h-48 bg-muted">
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
                {/* Slide number badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
                  Slide #{idx + 1}
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Tagline on image */}
                <div className="absolute bottom-2 left-3">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full border border-white/30">
                    {item.tagline}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">{item.judul}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{item.deskripsi}</p>
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
