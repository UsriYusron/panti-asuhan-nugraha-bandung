"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="dark relative h-screen w-full bg-black text-white overflow-hidden">
      <AdminHeader user={currentUser} onLogout={handleLogout} onMenuClick={() => setMobileOpen(!mobileOpen)} />

      {/* Main scrollable area */}
      <div className="h-full overflow-y-auto no-scrollbar">
        <main className="flex gap-6 p-6 pt-24 min-h-full">
          {/* Desktop Sidebar */}
          <AdminSidebar className="sticky top-24 h-[calc(100vh-8rem)] md:w-48 lg:w-60 bg-[#0D0D0D] rounded-2xl hidden md:flex p-8 overflow-y-auto" role={currentUser?.role} onLogout={handleLogout} />

          {/* Mobile sidebar drawer */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-40 pt-[68px]" onClick={() => setMobileOpen(false)}>
              <div
                className="absolute left-0 top-[68px] bottom-0 w-64 bg-[#0D0D0D] p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AdminSidebar role={currentUser?.role} onLogout={handleLogout} />
              </div>
              <div className="absolute inset-0 bg-black/60 -z-10" />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-6 min-w-0 mt-10 md:mt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
