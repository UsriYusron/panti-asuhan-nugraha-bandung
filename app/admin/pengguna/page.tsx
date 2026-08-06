"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Mail, ShieldCheck, ShieldAlert, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDataTable } from "@/hooks/use-data-table";
import { SearchBar, TablePagination } from "@/components/ui/data-table-components";

export default function PenggunaPage() {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "Pengurus"
  });

  const {
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages, paginatedData
  } = useDataTable(data, ["name", "email", "role"], 12);

  const fetchData = async () => {
    const res = await fetch("/api/pengguna");
    if (res.ok) setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/pengguna/${editingId}` : "/api/pengguna";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setIsOpen(false);
      setEditingId(null);
      setFormData({ name: "", email: "", password: "", role: "Pengurus" });
      fetchData();
    } else {
      alert("Gagal menyimpan pengguna.");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role || "Pengurus"
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      const res = await fetch(`/api/pengguna/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  const roleConfig = (role: string) => {
    if (role === "Admin") return {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
    };
    return {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
    };
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} pengguna terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Cari nama atau email..." />
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({ name: "", email: "", password: "", role: "Pengurus" });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({ name: "", email: "", password: "", role: "Pengurus" });
              }}><Plus className="mr-2 h-4 w-4" /> Tambah Pengguna</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Password {editingId && "(Kosongkan jika tidak ingin diubah)"}</Label>
                  <Input type="password" required={!editingId} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Peran (Role)</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="Admin">Admin</option>
                    <option value="Pengurus">Pengurus</option>
                  </select>
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
          <User className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Tidak ada pengguna</p>
          <p className="text-sm">Tambahkan pengguna pertama</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedData.map((item, idx) => {
            const rc = roleConfig(item.role);
            const colorClass = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={item._id}
                className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${colorClass}`} />

                {/* Card Body */}
                <div className="p-5 flex flex-col items-center text-center gap-3 flex-1">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                    {getInitials(item.name)}
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-semibold text-base leading-tight">{item.name}</h3>
                    <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${rc.color}`}>
                      {rc.icon}
                      {item.role}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full justify-center">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-[160px]">{item.email}</span>
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
