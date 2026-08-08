"use client";

import { Settings2, LogOut, UserCheck, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export function AdminHeader({ user, onLogout, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/10 backdrop-blur-[120px]">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#86efac] flex items-center justify-center">
          <span className="hidden md:inline text-black font-black text-xs tracking-tight">PA</span>
          <button onClick={onMenuClick} className="md:hidden flex items-center justify-center text-black">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-bold tracking-tight leading-none">PSAA Nugraha</span>
          <span className="text-[#919191] text-[10px] tracking-widest font-medium">ADMIN PANEL</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#919191]">
            <UserCheck className="h-3.5 w-3.5 text-[#86efac]" />
            <span className="text-[#E7E7E7] font-medium">{user.name}</span>
            <span className="bg-[#86efac]/10 text-[#86efac] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
              {user.role}
            </span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-gradient-to-br from-[#86efac] to-emerald-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#86efac]/30" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 bg-[#0D0D0D] border-[#1F1F1F] text-white"
          >
            <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer text-[#919191]">
              <Settings2 className="mr-2 h-4 w-4 text-[#919191]" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="focus:bg-[#1F1F1F] focus:text-red-400 cursor-pointer text-[#919191]"
            >
              <LogOut className="mr-2 h-4 w-4 text-[#919191]" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
