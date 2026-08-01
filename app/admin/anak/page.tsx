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
    searchTerm, setSearchTerm, sortConfig, handleSort,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["namaLengkap", "status"], 10);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Data Anak Asuh</h1>
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
                }} className="mb-4"><Plus className="mr-2 h-4 w-4" /> Tambah Data</Button>
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

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Foto</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("namaLengkap")}>
                Nama <SortIndicator columnKey="namaLengkap" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("jenisKelamin")}>
                L/P <SortIndicator columnKey="jenisKelamin" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("pendidikan")}>
                Pendidikan <SortIndicator columnKey="pendidikan" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("namaWali")}>
                Wali <SortIndicator columnKey="namaWali" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("tanggalMasuk")}>
                Tgl Masuk <SortIndicator columnKey="tanggalMasuk" sortConfig={sortConfig} />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                Status <SortIndicator columnKey="status" sortConfig={sortConfig} />
              </TableHead>
              {currentUser?.role === "Admin" && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={currentUser?.role === "Admin" ? 8 : 7} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell>
              </TableRow>
            ) : paginatedData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.gambar ? (
                    <img src={`/api/image/${item.gambar}`} alt={item.namaLengkap} className="w-10 h-10 object-cover rounded-md" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.namaLengkap}</TableCell>
                <TableCell>{item.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</TableCell>
                <TableCell>{item.pendidikan}</TableCell>
                <TableCell>{item.namaWali}</TableCell>
                <TableCell>{item.tanggalMasuk ? new Date(item.tanggalMasuk).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                    item.status === 'Tidak Aktif' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                {currentUser?.role === "Admin" && (
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
