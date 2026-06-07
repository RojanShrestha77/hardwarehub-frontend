"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/index";
import { selectCartItems, selectCartTotal, clearCart } from "@/store/slices/cartSlice";
import { createOrder, clearCurrentOrder } from "@/store/slices/orderSlice";
import { selectOrderSubmitting, selectOrderError, selectCurrentOrder } from "@/store/slices/orderSlice";
import type { PaymentMethod, ShippingAddress } from "@/lib/api/orders";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Package } from "lucide-react";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; desc: string }[] = [
  { value: "cash_on_delivery", label: "Cash on Delivery",  desc: "Pay when your order arrives" },
  { value: "khalti",           label: "Khalti",            desc: "Pay via Khalti digital wallet" },
  { value: "card",             label: "Card Payment",      desc: "Visa, Mastercard, etc." },
  { value: "online",           label: "Online Transfer",   desc: "Bank transfer or eSewa" },
];

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default function CheckoutPage() {
  const dispatch  = useDispatch<AppDispatch>();
  const router    = useRouter();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartTotal);
  const submitting = useSelector(selectOrderSubmitting);
  const error     = useSelector(selectOrderError);
  const placed    = useSelector(selectCurrentOrder);

  const shipping  = subtotal >= 5000 ? 0 : 300;
  const tax       = Math.round(subtotal * 0.13);
  const total     = subtotal + shipping + tax;

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "", phone: "", address: "", city: "", state: "", zipCode: "", country: "Nepal",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cash_on_delivery");

  useEffect(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  useEffect(() => {
    if (placed) {
      dispatch(clearCart());
    }
  }, [placed, dispatch]);

  if (items.length === 0 && !placed) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-20 flex flex-col items-center text-center">
        <Package size={64} className="text-[#333] mb-6" />
        <h1 className="text-2xl font-black uppercase text-white mb-2">Your cart is empty</h1>
        <Link href="/products" className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors mt-6">
          Browse Products
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-16">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase text-white mb-2">Order Placed!</h1>
          <p className="text-[#777] mb-2">Thank you for your order.</p>
          <p className="text-accent font-black text-lg mb-8">#{placed.orderNumber}</p>
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 text-left mb-8 space-y-3">
            {[
              ["Order Number", placed.orderNumber],
              ["Total",       `Rs. ${placed.total.toLocaleString()}`],
              ["Payment",     placed.paymentMethod.replace(/_/g, " ")],
              ["Status",      placed.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#555] font-bold uppercase tracking-wider text-[11px]">{k}</span>
                <span className="text-white font-bold capitalize">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors">
              Track Order
            </Link>
            <Link href="/products" className="border border-[#333] hover:border-[#555] text-[#aaa] hover:text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.zipCode) return;
    dispatch(createOrder({
      items: items.map((i) => ({
        productId:    i.product.id,
        productName:  i.product.name,
        productImage: i.product.imageUrl ?? undefined,
        quantity:     i.quantity,
        price:        i.product.price,
        sellerId:     "seller",
      })),
      shippingAddress: address,
      paymentMethod:   payment,
      shippingCost:    shipping,
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#1e1e1e]">
        <Link href="/cart" className="text-[#555] hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Checkout</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — Address + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping address */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6">
              <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">
                <MapPin size={15} className="text-accent" /> Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  ["fullName",  "Full Name",    "text",  true ],
                  ["phone",     "Phone Number", "tel",   true ],
                  ["address",   "Address",      "text",  true ],
                  ["city",      "City",         "text",  true ],
                  ["state",     "State/Province","text", false],
                  ["zipCode",   "ZIP / Postal Code","text",true],
                  ["country",   "Country",      "text",  true ],
                ] as [keyof ShippingAddress, string, string, boolean][]).map(([field, label, type, req]) => (
                  <div key={field} className={field === "address" ? "sm:col-span-2" : ""}>
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#555] mb-1.5">{label}{req && " *"}</label>
                    <input
                      type={type}
                      required={req}
                      value={address[field] ?? ""}
                      onChange={(e) => setAddress((p) => ({ ...p, [field]: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#0a0a0a] border border-[#222] text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6">
              <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">
                <CreditCard size={15} className="text-accent" /> Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.value} className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${payment === m.value ? "border-accent bg-accent/5" : "border-[#222] hover:border-[#333]"}`}>
                    <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} className="mt-0.5 accent-accent" />
                    <div>
                      <p className="text-sm font-black text-white">{m.label}</p>
                      <p className="text-xs text-[#555] mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-5 sticky top-24">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-5 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center text-xl shrink-0">
                      {item.product.imageUrl
                        ? <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain p-1" />
                        : <Package size={18} className="text-[#444]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold line-clamp-1">{item.product.name}</p>
                      <p className="text-[#555] text-xs">×{item.quantity}</p>
                    </div>
                    <p className="text-accent font-bold text-xs shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1e1e1e] pt-4 space-y-2 text-sm mb-5">
                <div className="flex justify-between"><span className="text-[#555]">Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Shipping</span><span className={shipping === 0 ? "text-green-400" : ""}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Tax (13% VAT)</span><span>Rs. {tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-black text-base border-t border-[#1e1e1e] pt-3 mt-3">
                  <span>Total</span><span className="text-accent">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.2em] py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
