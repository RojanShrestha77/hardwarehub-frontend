"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/index";
import { fetchOrderById, cancelOrder, selectCurrentOrder, selectOrderLoading, selectOrderError } from "@/store/slices/orderSlice";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, RotateCcw } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const imgSrc = (url: string | null | undefined) =>
  url ? (url.startsWith("http") ? url : `${API_BASE}${url}`) : null;
import type { OrderStatus } from "@/lib/api/orders";

const STATUS_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "text-yellow-400",  icon: <Clock size={14} /> },
  processing: { label: "Processing", color: "text-blue-400",    icon: <RotateCcw size={14} /> },
  shipped:    { label: "Shipped",    color: "text-purple-400",  icon: <Truck size={14} /> },
  delivered:  { label: "Delivered",  color: "text-green-400",   icon: <CheckCircle size={14} /> },
  cancelled:  { label: "Cancelled",  color: "text-red-400",     icon: <XCircle size={14} /> },
};

export default function OrderDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id }   = useParams<{ id: string }>();
  const order    = useSelector(selectCurrentOrder);
  const loading  = useSelector(selectOrderLoading);
  const error    = useSelector(selectOrderError);

  useEffect(() => { if (id) dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-20 flex justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-20 text-center">
        <p className="text-red-400 text-sm mb-4">{error ?? "Order not found"}</p>
        <Link href="/orders" className="text-accent hover:text-accent-hover text-sm font-bold">← Back to Orders</Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status];
  const canCancel = order.status === "pending" || order.status === "processing";
  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#1e1e1e]">
        <Link href="/orders" className="text-[#555] hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Order #{order.orderNumber}</h1>
          <p className="text-[#555] text-sm mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-black ${cfg.color}`}>
          {cfg.icon} {cfg.label}
        </div>
      </div>

      {/* Progress tracker */}
      {order.status !== "cancelled" && (
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Order Progress</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= stepIdx;
              const current = i === stepIdx;
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${done ? "bg-accent border-accent" : "bg-[#1a1a1a] border-[#333]"}`}>
                      {done ? <CheckCircle size={16} className="text-white" /> : <span className="text-[#444] text-xs font-bold">{i + 1}</span>}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider mt-2 ${current ? "text-accent" : done ? "text-[#aaa]" : "text-[#444]"}`}>
                      {STATUS_CONFIG[step].label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < stepIdx ? "bg-accent" : "bg-[#222]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">
              Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-[#161616] last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center shrink-0">
                    {imgSrc(item.productImage)
                      ? <img src={imgSrc(item.productImage)!} alt={item.productName} className="w-full h-full object-contain p-2" />
                      : <Package size={20} className="text-[#444]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm line-clamp-1">{item.productName}</p>
                    <p className="text-[#555] text-xs mt-0.5">×{item.quantity} @ Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-accent font-black text-sm shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-5">
            <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">
              <MapPin size={13} className="text-accent" /> Shipping Address
            </h2>
            <div className="text-sm text-[#888] space-y-1">
              <p className="text-white font-bold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Summary + actions */}
        <div className="space-y-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#555]">Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#555]">Shipping</span><span>{order.shippingCost === 0 ? <span className="text-green-400">FREE</span> : `Rs. ${order.shippingCost}`}</span></div>
              <div className="flex justify-between"><span className="text-[#555]">Tax</span><span>Rs. {order.tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-black text-base border-t border-[#1e1e1e] pt-3 mt-2">
                <span>Total</span><span className="text-accent">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-5">
            <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">
              <CreditCard size={13} className="text-accent" /> Payment
            </h2>
            <p className="text-sm text-[#888] capitalize">{order.paymentMethod.replace(/_/g, " ")}</p>
            <p className={`text-xs mt-1 font-bold uppercase ${order.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}`}>
              {order.paymentStatus.replace(/_/g, " ")}
            </p>
          </div>

          {canCancel && (
            <button
              onClick={() => dispatch(cancelOrder(order._id))}
              className="w-full flex items-center justify-center gap-2 border border-red-400/30 hover:border-red-400/60 text-red-400 text-[11px] font-black uppercase tracking-wider py-3 transition-colors"
            >
              <XCircle size={14} /> Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
