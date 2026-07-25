"use client"

import type React from "react"

import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Baby, Users, UserCheck, Briefcase, Map, Building, School } from "lucide-react"

const features = [
  {
    icon: Baby,
    title: "50",
    subtitle: "Total Anak Asuh",
    description: "Jumlah anak asuh dalam LKSA saat ini ",
    accent: "#AFFF00",
  },
  {
    icon: Users,
    title: "65",
    subtitle: "Total Anak Dampingan",
    description: "Jumlah anak asuh yang tidak tinggal di asrama",
    accent: "#FF6B35",
  },
  {
    icon: UserCheck,
    title: "6",
    subtitle: "Staff Pengasuh",
    description: "Jumlah pengasuh yang bertugas menjaga anak asuh",
    accent: "#00D4FF",
  },
  {
    icon: Briefcase,
    title: "15",
    subtitle: "Staff Pengurus",
    description: "Jumlah pengurus LKSA",
    accent: "#AFFF00",
  },
  {
    icon: Map,
    title: "2,492 m2",
    subtitle: "Luas Tanah",
    description: "Total Luas tanah",
    accent: "#ea00ffff",
  },
  {
    icon: Building,
    title: "600 m2",
    subtitle: "Gedung Panti",
    description: "Luas tanah gedung panti",
    accent: "#00ff80ff",
  },
  {
    icon: School,
    title: "1800 m2",
    subtitle: "Gedung Sekolah",
    description: "Luas tanah gedung sekolah",
    accent: "#ff8800ff",
  },
]

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [count, setCount] = useState(1)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const match = feature.title.match(/^([\d,.]+)(.*)$/)
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : NaN
  const rawSuffix = match ? match[2] : ""
  const suffix = rawSuffix.replace("m2", "m²")

  useEffect(() => {
    if (isInView && !isNaN(target)) {
      const controls = animate(1, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.floor(value))
        }
      })
      return controls.stop
    }
  }, [isInView, target])

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer"
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${feature.accent}40, transparent, ${feature.accent}40)`,
          filter: "blur(8px)",
        }}
      />

      {/* Card */}
      <div className="relative bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 overflow-hidden h-full">
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={false}
          animate={
            isHovered
              ? {
                background: [
                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.03) 25%, transparent 30%)",
                  "linear-gradient(105deg, transparent 70%, rgba(255,255,255,0.03) 75%, transparent 80%)",
                ],
              }
              : {}
          }
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full min-h-[140px]">
          {/* Icon with pulse animation */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative"
            style={{ backgroundColor: `${feature.accent}20` }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: feature.accent }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <feature.icon className="w-5 h-5 relative z-10" style={{ color: feature.accent }} />
          </motion.div>

          {/* Title with count-up feel */}
          <div className="flex-1">
            <motion.div
              className="text-3xl font-black tracking-tight text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 + index * 0.1 }}
            >
              <span style={{ color: feature.accent }}>{isNaN(target) ? feature.title : count.toLocaleString("id-ID") + suffix}</span>
            </motion.div>
            <h3 className="text-sm font-semibold text-white mt-1">{feature.subtitle}</h3>
            <p className="text-xs text-white/50 mt-1 font-mono">{feature.description}</p>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="h-[2px] rounded-full mt-4"
            style={{ backgroundColor: feature.accent }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="formula" className="relative py-16 bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#0a0a0a] to-[#121212]" />

      <div ref={ref} className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            className="inline-block font-mono text-[#AFFF00] text-[10px] tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            Data dalam angka
          </motion.span>

          <div className="overflow-hidden mt-2">
            <motion.h2
              className="text-3xl md:text-4xl font-black text-white tracking-tight"
              initial={{ y: 60 }}
              animate={isInView ? { y: 0 } : { y: 60 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            >
              Total Pelayanan
            </motion.h2>
          </div>

          {/* Animated underline */}
          <motion.div
            className="h-[2px] w-12 bg-[#AFFF00] mx-auto mt-3 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
