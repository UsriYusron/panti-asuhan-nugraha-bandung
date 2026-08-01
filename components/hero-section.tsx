"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.3,
    },
  },
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const smoothScroll = useSpring(scrollYProgress, springConfig)

  const y = useTransform(smoothScroll, [0, 1], [0, 200])
  const textX1 = useTransform(smoothScroll, [0, 1], [0, -100])
  const textX2 = useTransform(smoothScroll, [0, 1], [0, 100])
  const scale = useTransform(smoothScroll, [0, 0.5], [1, 0.9])
  const opacity = useTransform(smoothScroll, [0, 0.8], [1, 0])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white noise-overlay"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />

      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-[#AFFF00]/20 blur-3xl" />
      <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-[#AFFF00]/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div style={{ opacity }} className="space-y-5">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider"
            >
              <motion.span
                className="w-2 h-2 bg-[#AFFF00] rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              Panti Sosial Asuhan Anak Nugraha
            </motion.div>

            <div className="space-y-1 overflow-hidden">
              <motion.h1
                style={{ x: textX1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9]"
              >
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="inline-block"
                >
                  Membina
                </motion.span>
              </motion.h1>
              <motion.h1
                style={{ x: textX2 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9]"
              >
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="inline-block text-[#AFFF00]"
                >
                  Masa Depan
                </motion.span>
              </motion.h1>
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="text-lg md:text-xl font-mono text-[#121212]/60 tracking-tight pt-2 max-w-md"
              >
                Membina dan Membangun Kepribadian Anak Asuh Yang Berakhlakul Karimah dan Mandiri.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap gap-3 pt-2"
            >
              <motion.button
                className="bg-[#AFFF00] text-[#121212] px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 group relative overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Hubungi Kami</span>
                <motion.svg
                  className="w-4 h-4 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div style={{ y, scale }} className="relative flex justify-center">
            <motion.div variants={scaleInVariants} initial="hidden" animate="visible" className="relative">
              <div className="absolute inset-0 bg-[#84cc16]/30 blur-[80px] rounded-full scale-75 opacity-40" />

              <div className="relative">
                {/* Blur Putih Kiri */}
                {/* <div className="absolute inset-y-0 -left-10 w-1/3 bg-gradient-to-r from-white via-white/50 to-transparent z-20 pointer-events-none blur-xl" /> */}

                {/* Blur Putih Kanan */}
                {/* <div className="absolute inset-y-0 -right-10 w-1/3 bg-gradient-to-l from-white via-white/50 to-transparent z-20 pointer-events-none blur-xl" /> */}

                <Image
                  src="/images/muhamadusriyusron.png"
                  alt="Panti Asuhan Nugraha Energy Drink - Lemon Lime Flavour"
                  width={1200}
                  height={1200}
                  className="relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div className="w-5 h-8 border-2 border-[#121212]/30 rounded-full flex justify-center pt-1.5">
              <motion.div
                className="w-1 h-2 bg-[#121212]/30 rounded-full"
                animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
