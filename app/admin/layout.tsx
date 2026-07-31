"use client";

import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Calendar, Newspaper, LogOut, UserCheck } from "lucide-react";
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
    router.push("/login");
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
                <SidebarMenuButton isActive={pathname === "/admin"} onClick={() => router.push("/admin")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith("/admin/anak")} onClick={() => router.push("/admin/anak")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Data Anak</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith("/admin/kegiatan")} onClick={() => router.push("/admin/kegiatan")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Jadwal Kegiatan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith("/admin/berita")} onClick={() => router.push("/admin/berita")}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  <span>Berita & Pengumuman</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {currentUser?.role === "Admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={pathname.startsWith("/admin/pengguna")} onClick={() => router.push("/admin/pengguna")}>
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
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
