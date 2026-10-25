"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock } from "lucide-react";

export default function JadwalPage() {
  const [kegiatan, setKegiatan] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingAndCurrent = data.filter((item: any) => {
          if (!item.tanggal) return true;
          const activityDate = new Date(item.tanggal);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() >= today.getTime();
        }).map((item: any) => {
          let currentStatus = item.status || "Akan Datang";
          if (item.tanggal) {
            const activityDate = new Date(item.tanggal);
            activityDate.setHours(0, 0, 0, 0);
            if (activityDate.getTime() === today.getTime()) {
              currentStatus = "Berlangsung";
            } else if (activityDate.getTime() > today.getTime()) {
              currentStatus = "Akan Datang";
            }
          }
          return { ...item, status: currentStatus };
        });

        setKegiatan(upcomingAndCurrent);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-[#121212] text-white pt-16">
      <Navigation />

      {/* Sticky Header Judul */}
      <div className="sticky top-16 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#AFFF00]">
            Jadwal Kegiatan
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-1 max-w-3xl">
            Agenda dan kegiatan yang akan dan sedang berlangsung di Panti Asuhan Nugraha.
          </p>
        </div>
      </div>

      <div className="py-8 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kegiatan.length === 0 ? (
            <p className="text-white/50 col-span-full">Belum ada kegiatan yang dijadwalkan.</p>
          ) : (
            kegiatan.map((item) => (
              <Card key={item._id} className="bg-zinc-900 border-zinc-800 text-white flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${item.status === 'Akan Datang' ? 'bg-blue-500/20 text-blue-400' :
                      item.status === 'Berlangsung' ? 'bg-green-500/20 text-green-400' :
                        'bg-zinc-500/20 text-zinc-400'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight">{item.judul}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-3 text-sm text-zinc-300">
                  <p className="text-zinc-400 mb-2">{item.deskripsi}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <Calendar className="h-4 w-4 text-[#AFFF00]" />
                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#AFFF00]" />
                    <span>{item.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#AFFF00]" />
                    <span>{item.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#AFFF00]" />
                    <span>PIC: {item.pic}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
