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
} from "lucide-react";

interface AdminSidebarProps {
  role?: string;
  onLogout: () => void;
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
];

export function AdminSidebar({ role, onLogout, className = "" }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className={`flex flex-col shrink-0 ${className}`}>
      <nav className="flex flex-col gap-6">
        {navItems.map(({ label, icon: Icon, href }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex items-center gap-4 transition-colors cursor-pointer w-full text-left ${
              isActive(href)
                ? "text-[#E7E7E7]"
                : "text-[#919191] hover:text-[#E7E7E7]"
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${isActive(href) ? "text-[#86efac]" : ""}`}
            />
            <span className="text-xs font-semibold tracking-widest">{label}</span>
          </button>
        ))}

        {role === "Admin" && (
          <button
            onClick={() => router.push("/admin/pengguna")}
            className={`flex items-center gap-4 transition-colors cursor-pointer w-full text-left ${
              pathname.startsWith("/admin/pengguna")
                ? "text-[#E7E7E7]"
                : "text-[#919191] hover:text-[#E7E7E7]"
            }`}
          >
            <Users
              className={`h-5 w-5 shrink-0 ${
                pathname.startsWith("/admin/pengguna") ? "text-[#86efac]" : ""
              }`}
            />
            <span className="text-xs font-semibold tracking-widest">PENGGUNA</span>
          </button>
        )}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#1F1F1F] flex flex-col gap-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 text-[#919191] hover:text-red-400 transition-colors cursor-pointer w-full text-left"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold tracking-widest">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
