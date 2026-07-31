"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function BeritaPage() {
  const [berita, setBerita] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/berita")
      .then(res => res.json())
      .then(data => setBerita(data))
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#AFFF00]">
          Berita & Pengumuman
        </h1>
        <p className="text-white/70 mb-10 text-lg max-w-3xl">
          Informasi terbaru seputar kegiatan dan perkembangan di Panti Asuhan Nugraha.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {berita.length === 0 ? (
            <p className="text-white/50 col-span-full">Belum ada berita yang dipublikasikan.</p>
          ) : (
            berita.map((item) => (
              <div key={item._id} className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#AFFF00]/50 transition-colors">
                {item.gambarUrl ? (
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.gambarUrl} alt={item.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="h-48 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#AFFF00]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-zinc-600 font-bold text-2xl tracking-widest uppercase opacity-20">PSAA NUGRAHA</span>
                  </div>
                )}
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-[#AFFF00] text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.tanggalPublikasi).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-[#AFFF00] transition-colors">{item.judul}</h2>
                  <p className="text-zinc-400 mb-6 line-clamp-3">{item.konten}</p>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Oleh: {item.penulis}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
