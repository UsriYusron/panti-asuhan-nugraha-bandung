import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PendaftaranPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white pt-16">
      <Navigation />

      {/* Sticky Header Judul */}
      <div className="sticky top-16 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#AFFF00]">
            Pendaftaran Anak Asuh
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-1">
            Silakan isi formulir di bawah ini untuk mendaftarkan calon anak asuh ke Panti Asuhan Nugraha. Data yang Anda masukkan akan kami proses lebih lanjut.
          </p>
        </div>
      </div>

      <div className="py-8 pb-20 px-6 max-w-4xl mx-auto">

        <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800" style={{ height: "800px" }}>
          {/* Placeholder untuk Google Form iframe */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSf4uxq1FRAOSDFIRObbShI8czCasiToWR_sr6s6V1YPFRO6Pg/viewform?usp=publish-editor&embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Form Pendaftaran"
          >
            Memuat...
          </iframe>
        </div>
      </div>
      <Footer />
    </main>
  )
}
