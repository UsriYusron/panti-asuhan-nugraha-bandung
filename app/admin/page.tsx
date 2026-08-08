"use client";

import { useEffect, useState } from "react";
import { Users, CalendarDays, Newspaper, Activity, Wallet } from "lucide-react";

interface DashboardStats {
  countAnak: number;
  countKegiatanBulanIni: number;
  countBerita: number;
  jadwalTerdekat: unknown[];
}

function MetricSkeleton() {
  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 animate-pulse">
      <div className="h-3 w-20 bg-[#1F1F1F] rounded mb-4" />
      <div className="h-8 w-28 bg-[#1F1F1F] rounded" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col xl:flex-row gap-6 xl:items-end justify-between p-6 bg-[#0D0D0D] rounded-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#919191]">
            <Wallet className="h-5 w-5" />
            <span className="text-base tracking-wide">Selamat datang</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Dashboard Admin
          </div>
          <p className="text-[#919191] text-sm mt-1">
            Ringkasan aktivitas dan data PSAA Nugraha Bandung
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#86efac] animate-pulse" />
          <span className="text-sm text-[#919191]">Sistem Aktif</span>
        </div>
      </div>

      {/* Metrics grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Anak Asuh */}
          <div className="bg-[#0D0D0D] rounded-2xl p-6 flex flex-col gap-2 group hover:bg-[#141414] transition-colors">
            <div className="flex items-center justify-between text-[#919191]">
              <span className="text-xs font-semibold tracking-widest">TOTAL ANAK ASUH</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-4xl font-bold text-white mt-1">
              {stats?.countAnak ?? 0}
            </div>
            <span className="text-xs text-[#86efac] font-medium">Anak terdaftar</span>
          </div>

          {/* Kegiatan Bulan Ini */}
          <div className="bg-[#0D0D0D] rounded-2xl p-6 flex flex-col gap-2 group hover:bg-[#141414] transition-colors">
            <div className="flex items-center justify-between text-[#919191]">
              <span className="text-xs font-semibold tracking-widest">KEGIATAN BULAN INI</span>
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="text-4xl font-bold text-white mt-1">
              {stats?.countKegiatanBulanIni ?? 0}
            </div>
            <span className="text-xs text-[#86efac] font-medium">Kegiatan terjadwal</span>
          </div>

          {/* Total Berita */}
          <div className="bg-[#0D0D0D] rounded-2xl p-6 flex flex-col gap-2 group hover:bg-[#141414] transition-colors">
            <div className="flex items-center justify-between text-[#919191]">
              <span className="text-xs font-semibold tracking-widest">TOTAL BERITA</span>
              <Newspaper className="h-4 w-4" />
            </div>
            <div className="text-4xl font-bold text-white mt-1">
              {stats?.countBerita ?? 0}
            </div>
            <span className="text-xs text-[#86efac] font-medium">Artikel dipublikasi</span>
          </div>

          {/* Jadwal Terdekat */}
          <div className="bg-[#0D0D0D] rounded-2xl p-6 flex flex-col gap-2 group hover:bg-[#141414] transition-colors">
            <div className="flex items-center justify-between text-[#919191]">
              <span className="text-xs font-semibold tracking-widest">JADWAL TERDEKAT</span>
              <Activity className="h-4 w-4" />
            </div>
            <div className="text-4xl font-bold text-white mt-1">
              {stats?.jadwalTerdekat?.length ?? 0}
            </div>
            <span className="text-xs text-[#86efac] font-medium">Kegiatan akan datang</span>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Tambah Anak Asuh", href: "/admin/anak", desc: "Daftarkan anak asuh baru ke sistem" },
          { label: "Buat Berita", href: "/admin/berita", desc: "Tulis dan publish artikel berita" },
          { label: "Jadwal Kegiatan", href: "/admin/kegiatan", desc: "Atur jadwal dan kegiatan panti" },
        ].map(({ label, href, desc }) => (
          <a
            key={href}
            href={href}
            className="bg-[#0D0D0D] rounded-2xl p-6 flex flex-col gap-2 hover:bg-[#141414] transition-colors group border border-transparent hover:border-[#86efac]/20"
          >
            <span className="text-xs font-semibold tracking-widest text-[#919191] group-hover:text-[#86efac] transition-colors">
              {label.toUpperCase()}
            </span>
            <span className="text-white font-semibold">{label}</span>
            <span className="text-xs text-[#919191]">{desc}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
