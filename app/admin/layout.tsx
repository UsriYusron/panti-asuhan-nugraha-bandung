"use client";

import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Calendar, Newspaper, LogOut, UserCheck, Image, ClipboardList } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-zinc-950">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4 border-b space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Admin Panti</h2>
            {currentUser && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">{currentUser.name}</span>
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                  {currentUser.role}
                </span>
              </div>
            )}
          </SidebarHeader>
          <SidebarContent className="p-2 gap-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname === "/admin"} onClick={() => router.push("/admin")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/anak")} onClick={() => router.push("/admin/anak")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Data Anak</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/kegiatan")} onClick={() => router.push("/admin/kegiatan")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Jadwal Kegiatan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/berita")} onClick={() => router.push("/admin/berita")}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  <span>Berita & Pengumuman</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/sorotan")} onClick={() => router.push("/admin/sorotan")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Sorotan / Carousel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/galeri")} onClick={() => router.push("/admin/galeri")}>
                  <Image className="mr-2 h-4 w-4" />
                  <span>Galeri Foto</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="mb-2" isActive={pathname.startsWith("/admin/form-responses")} onClick={() => router.push("/admin/form-responses")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Respon GForm</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {currentUser?.role === "Admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton className="mb-6" isActive={pathname.startsWith("/admin/pengguna")} onClick={() => router.push("/admin/pengguna")}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manajemen Pengguna</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem className="mt-auto">
                <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
          <div className="md:hidden flex items-center p-4 border-b bg-slate-50 dark:bg-zinc-950 z-20 shrink-0">
            <SidebarTrigger />
            <span className="ml-3 font-semibold text-lg">Menu Admin</span>
          </div>
          <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
