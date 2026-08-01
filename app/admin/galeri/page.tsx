"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, SortIndicator, TablePagination } from "@/components/ui/data-table-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
    searchTerm, setSearchTerm, sortConfig, handleSort,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(galeriList, ["judul"], 10);

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
        <h1 className="text-3xl font-bold tracking-tight">Kelola Galeri Foto</h1>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari judul..." />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">
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

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Gambar</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("judul")}>
                Judul / Keterangan <SortIndicator columnKey="judul" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Belum ada data galeri foto.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="h-16 w-24 rounded overflow-hidden bg-muted flex items-center justify-center">
                      {item.gambar ? (
                        <img 
                          src={`/api/image/${item.gambar}`} 
                          alt={item.judul} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.judul}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
