"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AnakPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki",
    pendidikan: "", alamatAsal: "", namaWali: "", kontakWali: "", status: "Aktif"
  });

  const fetchData = async () => {
    const res = await fetch("/api/anak");
    if (res.ok) {
      setData(await res.json());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/anak", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setIsOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const res = await fetch(`/api/anak/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Data Anak Asuh</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Tambah Data</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Anak Asuh</DialogTitle>
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
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>L/P</TableHead>
              <TableHead>Pendidikan</TableHead>
              <TableHead>Wali</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell>
              </TableRow>
            ) : data.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.namaLengkap}</TableCell>
                <TableCell>{item.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</TableCell>
                <TableCell>{item.pendidikan}</TableCell>
                <TableCell>{item.namaWali}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
