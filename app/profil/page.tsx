import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 text-center text-[#AFFF00]">
          Profil Panti Asuhan
        </h1>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-zinc-800 pb-2">Sejarah Singkat</h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Panti Sosial Asuhan Anak (PSAA) Nugraha didirikan dengan niat luhur untuk membantu anak-anak yatim, piatu, yatim piatu, dan dhuafa. Kami berkomitmen untuk memberikan pengasuhan, pendidikan, dan bimbingan agar mereka menjadi generasi yang berakhlakul karimah dan mandiri.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#AFFF00] mb-4">Visi</h3>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  "Membina dan Membangun Kepribadian Anak Asuh Yang Berakhlakul Karimah dan Mandiri"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#AFFF00] mb-4">Misi</h3>
                <ul className="list-disc list-outside ml-5 space-y-3 text-zinc-300 text-lg">
                  <li>Memberikan pelayanan pemenuhan kebutuhan jasmani, rohani, dan sosial bagi anak asuh.</li>
                  <li>Memberikan beasiswa pendidikan.</li>
                  <li>Membina anak asuh dengan ilmu agama.</li>
                  <li>Menyelenggarakan pelatihan keterampilan untuk bekal masa depan.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-zinc-800 pb-2">Struktur Organisasi</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex items-center justify-center min-h-[300px]">
              <p className="text-zinc-500 text-center">Bagan Struktur Organisasi akan ditampilkan di sini.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-zinc-800 pb-2">Kontak & Alamat</h2>
            <div className="grid md:grid-cols-2 gap-8 text-zinc-300 text-lg">
              <div>
                <h4 className="font-bold text-white mb-2">Alamat</h4>
                <p>Jl. Contoh Alamat Panti No. 123,<br/>Kota Bandung, Jawa Barat 40123</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Hubungi Kami</h4>
                <p>Telepon: (022) 1234567<br/>Email: psaanugraha@gmail.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
