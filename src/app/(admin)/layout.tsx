"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, Users, Store, ShoppingBag,
  Wrench, LogOut, ChevronRight, ClipboardList,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const NAV = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/orders",       label: "Orders",       icon: Package          },
  { href: "/admin/users",        label: "Users",        icon: Users            },
  { href: "/admin/sellers",      label: "Sellers",      icon: Store            },
  { href: "/admin/products",     label: "Products",     icon: ShoppingBag      },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-center w-8 h-8 bg-accent">
            <Wrench size={16} className="text-white" />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-wide text-white">HardwareHub</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-all",
                  active
                    ? "bg-accent text-white"
                    : "text-[#666] hover:text-white hover:bg-[#1a1a1a]"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1a1a1a]">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-[#555] truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#666] hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-[#0d0d0d] border-b border-[#1a1a1a] flex items-center px-6 gap-2 text-[#555] text-xs">
          <Link href="/" className="hover:text-white transition-colors">Site</Link>
          <ChevronRight size={12} />
          <span className="text-white font-bold">
            {NAV.find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)))?.label ?? "Admin"}
          </span>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
