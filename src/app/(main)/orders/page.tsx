"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/index";
import { fetchMyOrders, selectOrders, selectOrderLoading, selectOrderError } from "@/store/slices/orderSlice";
import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, RotateCcw } from "lucide-react";
import type { OrderStatus } from "@/lib/api/orders";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", icon: <Clock size={12} /> },
  processing: { label: "Processing", color: "text-blue-400 border-blue-400/30 bg-blue-400/10",       icon: <RotateCcw size={12} /> },
  shipped:    { label: "Shipped",    color: "text-purple-400 border-purple-400/30 bg-purple-400/10", icon: <Truck size={12} /> },
  delivered:  { label: "Delivered",  color: "text-green-400 border-green-400/30 bg-green-400/10",    icon: <CheckCircle size={12} /> },
  cancelled:  { label: "Cancelled",  color: "text-red-400 border-red-400/30 bg-red-400/10",          icon: <XCircle size={12} /> },
};

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const orders   = useSelector(selectOrders);
  const loading  = useSelector(selectOrderLoading);
  const error    = useSelector(selectOrderError);

  useEffect(() => { dispatch(fetchMyOrders({})); }, [dispatch]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8 border-b border-[#1e1e1e] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Package size={28} className="text-accent" /> My Orders
          </h1>
          <p className="text-[#555] text-sm mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <Link href="/products" className="text-[11px] font-black uppercase tracking-wider text-[#555] hover:text-white border border-[#222] px-4 py-2 transition-colors">
          Continue Shopping
        </Link>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-20">
          <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm py-8 text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={64} className="text-[#333] mb-6" />
          <h2 className="text-xl font-black uppercase text-white mb-2">No orders yet</h2>
          <p className="text-[#555] text-sm mb-8">Your order history will appear here.</p>
          <Link href="/products" className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="flex items-center gap-4 bg-[#0f0f0f] border border-[#1e1e1e] hover:border-accent/40 p-4 sm:p-5 transition-all group"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border border-[#222] shrink-0">
                  <Package size={20} className="text-accent" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-white font-black text-sm">#{order.orderNumber}</p>
                      <p className="text-[#555] text-xs mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-accent font-black text-sm">Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-[#444] text-xs mt-1.5 line-clamp-1">
                    {order.items.map((i) => i.productName).join(", ")}
                  </p>
                </div>

                <ChevronRight size={18} className="text-[#333] group-hover:text-accent transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
