"use client"

import { motion, useInView } from "framer-motion"
import LogoLoop from "./logo-loop"
import { useRef } from "react"

// Baris 1 — 6 logo pertama (bergerak kanan ke kiri)
const row1 = [
  { src: "/logos/bca.png", alt: "BCA", title: "BCA", logoHeight: 200 },
  { src: "/logos/itenas.png", alt: "Itenas", title: "Itenas", logoHeight: 200 },
  { src: "/logos/bri.png", alt: "BRI", title: "BRI" },
  { src: "/logos/uin.png", alt: "UIN", title: "UIN", logoHeight: 130 },
  { src: "/logos/mandiri.png", alt: "Mandiri", title: "Mandiri" },
  { src: "/logos/ukri.png", alt: "UKRI", title: "UKRI", logoHeight: 120 },
]

// Baris 2 — 6 logo berikutnya (bergerak kiri ke kanan)
const row2 = [
  { src: "/logos/bjb.png", alt: "BJB", title: "BJB" },
  { src: "/logos/inpas.png", alt: "Inpas", title: "Inpas", logoHeight: 100 },
  { src: "/logos/pkbi.png", alt: "PKBI", title: "PKBI", logoHeight: 100 },
  { src: "/logos/dinsos.png", alt: "Dinsos", title: "Dinsos", logoHeight: 55 },
  { src: "/logos/pkbi-jabar.png", alt: "PKBI Jabar", title: "PKBI Jabar", logoHeight: 55 },
  { src: "/logos/poltekesos.png", alt: "Poltekesos", title: "Poltekesos", logoHeight: 100 },
]

// Baris 3 — 6 logo terakhir (bergerak kanan ke kiri)
const row3 = [
  { src: "/logos/rshs.png", alt: "RSHS", title: "RSHS", logoHeight: 80 },
  { src: "/logos/sttb.png", alt: "STTB", title: "STTB", logoHeight: 95 },
  { src: "/logos/unla.png", alt: "UNLA", title: "UNLA", logoHeight: 100 },
  { src: "/logos/citereup.png", alt: "Citereup", title: "Citereup", logoHeight: 100 },
  { src: "/logos/dharma.png", alt: "Dharma", title: "Dharma", logoHeight: 100 },
  { src: "/logos/stia.png", alt: "STIA", title: "STIA", logoHeight: 100 },
]

const commonProps = {
  logoHeight: 150,
  gap: 48,
  hoverSpeed: 0,
  scaleOnHover: true,
  fadeOut: true,
  fadeOutColor: "#ffffff",
} as const

export function TechStackSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      <div className="px-0">
        <div ref={ref} className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-10"
          >

            <div className="overflow-hidden">
              <motion.h2
                className="text-3xl md:text-4xl font-black text-black tracking-tight"
                initial={{ y: 60 }}
                animate={isInView ? { y: 0 } : { y: 60 }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
              >
                Kerja Sama Mitra
              </motion.h2>
            </div>


            {/* Animated underline */}
            <motion.div
              className="h-[2px] w-30 bg-[#AFFF00] mx-auto mt-3 mb-5 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            />

            <motion.p
              className="text-sm text-[#121212]/60 font-mono mt-2 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              PSAA Nugraha selalu terbuka untuk menjalin kerja sama dengan berbagai mitra meliputi lembaga perekonomian, lembaga pendidikan, lembaga kesehatan hingga isntansi pemerintahan untuk meningkatkan kesejahteraan dan kemandirian anak asuh.
            </motion.p>
          </motion.div>
        </div>

        {/* Baris 1 — kanan ke kiri */}
        <div className="mb-6">
          <LogoLoop
            logos={row1}
            speed={80}
            direction="left"
            ariaLabel="Mitra institusi baris 1"
            {...commonProps}
          />
        </div>

        {/* Baris 2 — kiri ke kanan */}
        <div className="mb-6">
          <LogoLoop
            logos={row2}
            speed={80}
            direction="right"
            ariaLabel="Mitra institusi baris 2"
            {...commonProps}
          />
        </div>

        {/* Baris 3 — kanan ke kiri */}
        <div>
          <LogoLoop
            logos={row3}
            speed={80}
            direction="left"
            ariaLabel="Mitra institusi baris 3"
            {...commonProps}
          />
        </div>
      </div>
    </section>
  )
}
