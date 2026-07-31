import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PendaftaranPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#AFFF00]">
          Pendaftaran Anak Asuh
        </h1>
        <p className="text-white/70 mb-10 text-lg">
          Silakan isi formulir di bawah ini untuk mendaftarkan calon anak asuh ke Panti Asuhan Nugraha. Data yang Anda masukkan akan kami proses lebih lanjut.
        </p>
        
        <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800" style={{ height: "800px" }}>
          {/* Placeholder untuk Google Form iframe */}
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfwPlaceholderGoogleForm/viewform?embedded=true" 
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
