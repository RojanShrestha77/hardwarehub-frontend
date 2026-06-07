"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats, type AdminStats } from "@/lib/api/admin";
import { TrendingUp, Package, Users, ShoppingBag, Store, AlertCircle, Clock, CheckCircle, Truck, XCircle, RotateCcw } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  pending:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped:    "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered:  "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled:  "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function AdminDashboard() {
  const [stats, setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );

  if (!stats) return <p className="text-red-400">Failed to load stats.</p>;

  const CARDS = [
    { label: "Total Revenue",   value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp,  color: "text-green-400",  bg: "bg-green-400/10"  },
    { label: "Total Orders",    value: stats.totalOrders,                             icon: Package,     color: "text-accent",     bg: "bg-accent/10"     },
    { label: "Registered Users",value: stats.totalUsers,                             icon: Users,       color: "text-blue-400",   bg: "bg-blue-400/10"   },
    { label: "Products Listed", value: stats.totalProducts,                           icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Active Sellers",  value: stats.totalSellers,                            icon: Store,       color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Pending Approvals",value: stats.pendingSellers,                        icon: AlertCircle, color: stats.pendingSellers > 0 ? "text-accent" : "text-[#555]", bg: stats.pendingSellers > 0 ? "bg-accent/10" : "bg-[#1a1a1a]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Dashboard</h1>
        <p className="text-[#555] text-sm mt-1">Platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#0f0f0f] border border-[#1e1e1e] p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#555] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[#0f0f0f] border border-[#1e1e1e]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-wider text-accent hover:text-accent-hover transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#161616]">
          {stats.recentOrders.length === 0 ? (
            <p className="text-[#555] text-sm text-center py-10">No orders yet.</p>
          ) : stats.recentOrders.map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">#{o.orderNumber}</p>
                <p className="text-xs text-[#555] mt-0.5">{o.shippingFullName} · {new Date(o.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}</p>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 border ${STATUS_BADGE[o.status] ?? "text-[#555] bg-[#1a1a1a] border-[#333]"}`}>
                {o.status}
              </span>
              <span className="text-accent font-black text-sm shrink-0">Rs. {o.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.pendingSellers > 0 && (
        <div className="bg-accent/10 border border-accent/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-accent" />
            <p className="text-sm font-bold text-white">
              {stats.pendingSellers} seller{stats.pendingSellers > 1 ? "s" : ""} waiting for approval
            </p>
          </div>
          <Link href="/admin/sellers?filter=pending" className="text-[10px] font-black uppercase tracking-wider text-accent hover:text-accent-hover transition-colors">
            Review →
          </Link>
        </div>
      )}
    </div>
  );
}
