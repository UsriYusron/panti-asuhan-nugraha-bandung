"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, User, BookOpen, Phone, Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";

export default function AnakPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki",
    pendidikan: "", alamatAsal: "", namaWali: "", kontakWali: "", status: "Aktif",
    tanggalMasuk: "", gambar: ""
  });

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["namaLengkap", "status"], 12);

  const fetchData = async () => {
    const res = await fetch("/api/anak");
    if (res.ok) {
      setData(await res.json());
    }
  };

  useEffect(() => {
    fetchData();
    fetch("/api/auth/me").then(res => res.json()).then(data => {
      if (data.user) setCurrentUser(data.user);
    });
  }, []);

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

    const url = editingId ? `/api/anak/${editingId}` : "/api/anak";
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
        namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki",
        pendidikan: "", alamatAsal: "", namaWali: "", kontakWali: "", status: "Aktif",
        tanggalMasuk: "", gambar: ""
      });
      fetchData();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setImageFile(null);
    setFormData({
      namaLengkap: item.namaLengkap || "", 
      tempatLahir: item.tempatLahir || "", 
      tanggalLahir: item.tanggalLahir ? item.tanggalLahir.split('T')[0] : "", 
      jenisKelamin: item.jenisKelamin || "Laki-laki",
      pendidikan: item.pendidikan || "", 
      alamatAsal: item.alamatAsal || "", 
      namaWali: item.namaWali || "", 
      kontakWali: item.kontakWali || "", 
      status: item.status || "Aktif",
      tanggalMasuk: item.tanggalMasuk ? item.tanggalMasuk.split('T')[0] : "",
      gambar: item.gambar || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const res = await fetch(`/api/anak/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  const statusColor = (status: string) => {
    switch(status) {
      case "Aktif": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "Tidak Aktif": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "Lulus": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Anak Asuh</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} anak terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari nama atau status..." />
          {currentUser?.role === "Admin" && (
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEditingId(null);
                setImageFile(null);
                setFormData({
                  namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki",
                  pendidikan: "", alamatAsal: "", namaWali: "", kontakWali: "", status: "Aktif",
                  tanggalMasuk: "", gambar: ""
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingId(null);
                  setImageFile(null);
                  setFormData({
                    namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki",
                    pendidikan: "", alamatAsal: "", namaWali: "", kontakWali: "", status: "Aktif",
                    tanggalMasuk: "", gambar: ""
                  });
                }}><Plus className="mr-2 h-4 w-4" /> Tambah Data</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Anak Asuh" : "Tambah Anak Asuh"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input required value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tempat Lahir</Label>
                    <Input required value={formData.tempatLahir} onChange={e => setFormData({...formData, tempatLahir: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Lahir</Label>
                    <Input type="date" required value={formData.tanggalLahir} onChange={e => setFormData({...formData, tanggalLahir: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pendidikan</Label>
                    <Input required value={formData.pendidikan} onChange={e => setFormData({...formData, pendidikan: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Wali</Label>
                    <Input required value={formData.namaWali} onChange={e => setFormData({...formData, namaWali: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Kontak Wali</Label>
                    <Input required value={formData.kontakWali} onChange={e => setFormData({...formData, kontakWali: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Masuk</Label>
                    <Input type="date" required value={formData.tanggalMasuk} onChange={e => setFormData({...formData, tanggalMasuk: e.target.value})} />
                  </div>
                  {editingId && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                        <option value="Lulus">Lulus</option>
                        <option value="Keluar">Keluar</option>
                      </select>
                    </div>
                  )}
                  <div className="space-y-2 col-span-2">
                    <Label>Foto Anak</Label>
                    <Input type="file" accept="image/png, image/jpeg" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Alamat Asal</Label>
                    <Input required value={formData.alamatAsal} onChange={e => setFormData({...formData, alamatAsal: e.target.value})} />
                  </div>
                  <div className="col-span-2 flex justify-end mt-4">
                    <Button type="submit">Simpan</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Card Grid */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <User className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Tidak ada data anak asuh</p>
          <p className="text-sm">Mulai tambahkan data anak asuh</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedData.map((item) => (
            <div
              key={item._id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Card Header — Foto */}
              <div className="relative h-40 bg-muted">
                {item.gambar ? (
                  <img
                    src={`/api/image/${item.gambar}`}
                    alt={item.namaLengkap}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
                {/* Status Badge */}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(item.status)}`}>
                  {item.status}
                </span>
                {/* Gender Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/50 text-white">
                  {item.jenisKelamin === "Laki-laki" ? "♂ L" : "♀ P"}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-base leading-tight line-clamp-1">{item.namaLengkap}</h3>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{item.pendidikan || "-"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">Wali: {item.namaWali || "-"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{item.kontakWali || "-"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>Masuk: {item.tanggalMasuk ? new Date(item.tanggalMasuk).toLocaleDateString('id-ID') : '-'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{item.alamatAsal || "-"}</span>
                </div>
              </div>

              {/* Card Footer — Actions */}
              {currentUser?.role === "Admin" && (
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
              )}
            </div>
          ))}
        </div>
      )}

      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
