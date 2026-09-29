"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  LogOut,
  Image,
  ClipboardList,
  Star,
  HeartHandshake,
} from "lucide-react";

interface AdminSidebarProps {
  role?: string;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}

const navItems = [
  { label: "DASHBOARD", icon: LayoutDashboard, href: "/admin" },
  { label: "DATA ANAK", icon: Users, href: "/admin/anak" },
  { label: "KEGIATAN", icon: Calendar, href: "/admin/kegiatan" },
  { label: "BERITA", icon: Newspaper, href: "/admin/berita" },
  { label: "SOROTAN", icon: Star, href: "/admin/sorotan" },
  { label: "GALERI", icon: Image, href: "/admin/galeri" },
  { label: "FORM RESPON", icon: ClipboardList, href: "/admin/form-responses" },
  { label: "LAPORAN DONASI", icon: HeartHandshake, href: "/admin/donasi" },
];

export function AdminSidebar({ role, onLogout, onNavigate, className = "" }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleNav = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  return (
    <aside className={`flex flex-col shrink-0 ${className}`}>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, href }) => (
          <button
            key={href}
            onClick={() => handleNav(href)}
            className={`flex items-center gap-4 transition-all duration-200 cursor-pointer w-full text-left rounded-xl px-3 py-2.5 ${
              isActive(href)
                ? "bg-[#E7C84A]/15 text-[#E7C84A]"
                : "text-[#919191] hover:bg-[#E7C84A]/10 hover:text-[#E7C84A]"
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${isActive(href) ? "text-[#E7C84A]" : ""}`}
            />
            <span className="text-xs font-semibold tracking-widest">{label}</span>
            {isActive(href) && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E7C84A]" />
            )}
          </button>
        ))}

        {role === "Admin" && (
          <button
            onClick={() => handleNav("/admin/pengguna")}
            className={`flex items-center gap-4 transition-all duration-200 cursor-pointer w-full text-left rounded-xl px-3 py-2.5 ${
              pathname.startsWith("/admin/pengguna")
                ? "bg-[#E7C84A]/15 text-[#E7C84A]"
                : "text-[#919191] hover:bg-[#E7C84A]/10 hover:text-[#E7C84A]"
            }`}
          >
            <Users
              className={`h-5 w-5 shrink-0 ${
                pathname.startsWith("/admin/pengguna") ? "text-[#E7C84A]" : ""
              }`}
            />
            <span className="text-xs font-semibold tracking-widest">PENGGUNA</span>
            {pathname.startsWith("/admin/pengguna") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E7C84A]" />
            )}
          </button>
        )}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#1F1F1F] flex flex-col gap-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 text-[#919191] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer w-full text-left rounded-xl px-3 py-2.5"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold tracking-widest">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
