"use client";

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function GaleriPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGaleri() {
      try {
        const res = await fetch("/api/galeri");
        const data = await res.json();
        if (Array.isArray(data)) {
          setImages(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGaleri();
  }, []);

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#AFFF00] text-center">
          Galeri Kegiatan
        </h1>
        <p className="text-white/70 mb-12 text-lg text-center max-w-2xl mx-auto">
          Momen-momen kebersamaan dan berbagai kegiatan edukatif, sosial, serta keagamaan di Panti Asuhan Nugraha.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#AFFF00]" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Belum ada dokumentasi kegiatan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {images.map((img) => (
              <div key={img._id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                <img 
                  src={`/api/image/${img.gambar}`} 
                  alt={img.judul} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-bold">{img.judul}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
