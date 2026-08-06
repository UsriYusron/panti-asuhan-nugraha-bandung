"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminGaleri() {
  const [galeriList, setGaleriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(galeriList, ["judul"], 12);

  const fetchGaleri = async () => {
    try {
      const res = await fetch("/api/galeri");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGaleriList(data);
      }
    } catch (error) {
      console.error("Error fetching galeri:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !file) {
      alert("Harap lengkapi semua field");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengupload gambar");
      }

      const uploadData = await uploadRes.json();
      const imageId = uploadData.imageId;

      // 2. Save Galeri data
      const galeriRes = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          gambar: imageId,
        }),
      });

      if (galeriRes.ok) {
        setIsOpen(false);
        setJudul("");
        setFile(null);
        fetchGaleri();
      } else {
        const errorData = await galeriRes.json();
        alert(`Gagal menyimpan data: ${errorData.message}`);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;

    try {
      const res = await fetch(`/api/galeri/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchGaleri();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Galeri Foto</h1>
          <p className="text-muted-foreground text-sm mt-1">{galeriList.length} foto tersimpan</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari judul..." />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Foto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Foto Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul / Keterangan</Label>
                <Input
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul foto..."
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Gambar</Label>
                <Input
                  required
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="mr-2">
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Card Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 opacity-50" />
          <p>Memuat galeri foto...</p>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada foto</p>
          <p className="text-sm">Tambahkan foto pertama ke galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {paginatedData.map((item: any) => (
            <div
              key={item._id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                {item.gambar ? (
                  <img
                    src={`/api/image/${item.gambar}`}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>

              {/* Card Body */}
              <div className="px-3 py-2 flex-1">
                <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">{item.judul}</p>
              </div>

              {/* Card Footer */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
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
