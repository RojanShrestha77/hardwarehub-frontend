"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminOrders, updateOrderStatus, type AdminOrder } from "@/lib/api/admin";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES = ["", "pending", "processing", "shipped", "delivered", "cancelled"];

const BADGE: Record<string, string> = {
  pending:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped:    "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered:  "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled:  "text-red-400 bg-red-400/10 border-red-400/30",
};

const PAY_BADGE: Record<string, string> = {
  paid:            "text-green-400",
  pending_payment: "text-yellow-400",
  not_required:    "text-[#555]",
  failed:          "text-red-400",
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<AdminOrder[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const size = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders(page, size, status || undefined);
      setOrders(res.orders);
      setTotal(res.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o)));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Orders</h1>
          <p className="text-[#555] text-sm mt-1">{total} total orders</p>
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-9 px-3 bg-[#0f0f0f] border border-[#222] text-sm text-white focus:outline-none focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Statuses"}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-16 text-[#555]">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-[#555]">No orders found.</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3 font-bold text-white">#{o.orderNumber}</td>
                <td className="px-4 py-3 text-[#aaa] max-w-[120px] truncate">{o.shippingFullName}</td>
                <td className="px-4 py-3 text-[#666]">{o.items?.length ?? "—"}</td>
                <td className="px-4 py-3 font-bold text-accent">Rs. {o.total.toLocaleString()}</td>
                <td className={`px-4 py-3 text-xs font-bold uppercase ${PAY_BADGE[o.paymentStatus] ?? "text-[#555]"}`}>
                  {o.paymentStatus.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 border ${BADGE[o.status] ?? "text-[#555] bg-[#1a1a1a] border-[#333]"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#555] text-xs">
                  {new Date(o.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="h-7 px-2 bg-[#1a1a1a] border border-[#333] text-xs text-white focus:outline-none focus:border-accent disabled:opacity-50 cursor-pointer"
                  >
                    {STATUSES.filter(Boolean).map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#555]">Page {page} of {totalPages} · {total} orders</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
