import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function GaleriPage() {
  const images = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i + 10}/600/400`,
    title: `Dokumentasi Kegiatan ${i + 1}`,
  }));

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
              <img 
                src={img.url} 
                alt={img.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <p className="text-white font-bold">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
