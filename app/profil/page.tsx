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
            <div className="space-y-4 text-lg text-zinc-300 leading-relaxed text-justify">
              <p>
                <strong>Panti Sosial Asuhan Anak (PSAA) Nugraha</strong> didirikan dengan niat luhur untuk membantu anak-anak yatim, piatu, yatim piatu, dan dhuafa. Kami berkomitmen untuk memberikan pengasuhan, pendidikan, dan bimbingan agar mereka tumbuh menjadi generasi yang berakhlakul karimah, mandiri, serta mampu berkontribusi positif bagi masyarakat.
              </p>
              <p>
                Komitmen tersebut telah diwujudkan sejak PSAA Nugraha Kota Bandung mulai dirintis pada Agustus 1979 oleh Bapak MO. Miftahudin NDY (Alm.) di bawah naungan <strong>Yayasan Yatim Piatu Nugraha Bandung Raya</strong>. Seiring dengan perkembangan lembaga dan adanya perubahan kepemilikan tanah serta bangunan, pada 11 Maret 1986 nama yayasan diubah menjadi <strong>Yayasan Esa Nugraha Bhakti Provinsi Jawa Barat</strong>. Selanjutnya, untuk menyesuaikan dengan ketentuan peraturan perundang-undangan mengenai yayasan, pada tahun 2006 nama yayasan kembali berubah menjadi <strong>Yayasan Esa Nugraha Bhakti Bandung</strong> berdasarkan Akta Notaris Drs. Juher Zaidir, S.H. Nomor 5 tanggal 16 Maret 2006 yang telah memperoleh pengesahan dari Menteri Hukum dan Hak Asasi Manusia Republik Indonesia Nomor C-1320.HT.01.02 Tahun 2006.
              </p>
              <p>
                Dalam upaya memperkuat legalitas dan tata kelola organisasi, yayasan kembali melakukan perubahan anggaran dasar melalui Akta Notaris Esti Priani, S.H., M.Kn. Nomor 01 tanggal 6 Maret 2020 yang disahkan oleh Kementerian Hukum dan HAM Republik Indonesia dengan Nomor AHU-0006100.AH.01.12 Tahun 2020 tanggal 10 Maret 2020. Perubahan tersebut kemudian disempurnakan kembali melalui Akta Notaris Esti Priani, S.H., M.Kn. Nomor 04 tanggal 30 Januari 2024 yang memperoleh pengesahan dari Kementerian Hukum dan HAM Republik Indonesia Nomor AHU-0004440.AH.01.12 Tahun 2026.
              </p>
              <p>
                Hingga saat ini, PSAA Nugraha terus berupaya berperan aktif dalam mendukung program pemerintah untuk mengurangi angka kemiskinan di Indonesia. Melalui pembinaan, pengasuhan, pendidikan, dan pengembangan karakter, lembaga ini membekali anak-anak asuh dengan pengetahuan, keterampilan, serta nilai-nilai moral agar tumbuh menjadi pribadi yang mandiri, bertanggung jawab, dan siap memberikan kontribusi bagi masa depan bangsa dan negara.
              </p>
            </div>
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
                <p className="text-zinc-300 text-lg leading-relaxed">
                  "Meningkatkan Kesejahteraan dan Kemandirian Anak asuh Dalam Menyongsong Kehidupan Bermasyarakat Dimasa Depan"
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-zinc-800 pb-2">Struktur Organisasi</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Penanggung Jawab & Ketua */}
                <div className="space-y-6 md:col-span-3">
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-[#AFFF00] md:w-64 shrink-0">Penanggung Jawab</h3>
                    <p className="text-zinc-300 text-lg">Dr. Eko Firmansyah, ST., M.Pd</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-[#AFFF00] md:w-64 shrink-0">Ketua</h3>
                    <p className="text-zinc-300 text-lg">Dr. H. Agus Sutardi, S.Pd., M.Pd.</p>
                  </div>
                </div>

                {/* Sekretaris & Bendahara & Pekerja Sosial */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#AFFF00] mb-3">Sekretaris</h3>
                    <ol className="list-decimal list-inside text-zinc-300 space-y-2 text-lg">
                      <li>Yani Astika Lomri, M.Pd</li>
                      <li>Mulyana, S.Sos</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#AFFF00] mb-3">Bendahara</h3>
                    <ol className="list-decimal list-inside text-zinc-300 space-y-2 text-lg">
                      <li>Hj. Ecin Kuraesin</li>
                      <li>Hj. Ukasih Yuna</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#AFFF00] mb-3">Pekerja Sosial</h3>
                    <ol className="list-decimal list-inside text-zinc-300 space-y-2 text-lg">
                      <li>Moh. Faizal Noor Agustian, M.Tr.Sos</li>
                    </ol>
                  </div>
                </div>

                {/* Bidang Pendidikan */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#AFFF00] mb-3">Bidang Pendidikan</h3>
                    <ol className="list-decimal list-inside text-zinc-300 space-y-2 text-lg">
                      <li>Atep Rohmana, S.Pd.I</li>
                      <li>Nurul Khomisah, S.Ag</li>
                      <li>Dede Rusmana, S.Pd.I</li>
                    </ol>
                  </div>
                </div>

                {/* Bidang Rumah Tangga */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#AFFF00] mb-3">Bidang Rumah Tangga</h3>
                    <ol className="list-decimal list-inside text-zinc-300 space-y-2 text-lg">
                      <li>Hj. Suiswaty Muas</li>
                      <li>Uten Supriatna</li>
                      <li>Bardi Daryaman</li>
                      <li>Hj. Ai Herawati, Dra.</li>
                      <li>Popi Sri Lestari, S.IP., MSi</li>
                    </ol>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-zinc-800 pb-2">Kontak & Alamat</h2>
            <div className="grid md:grid-cols-2 gap-8 text-zinc-300 text-lg">
              <div>
                <h4 className="font-bold text-white mb-2">Alamat</h4>
                <p>Jl. Contoh Alamat Panti No. 123,<br />Kota Bandung, Jawa Barat 40123</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Hubungi Kami</h4>
                <p>Telepon: (022) 1234567<br />Email: psaanugraha@gmail.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
