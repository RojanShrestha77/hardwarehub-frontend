"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/index";
import {
  fetchCart, addToCart, updateCartItem,
  removeFromCart, clearCart,
  selectCartItems, selectCartTotal, selectCartCount,
  selectCartLoading, selectCartError,
} from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Trash2, ShoppingBag, ArrowLeft, ChevronRight, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const SHIPPING_THRESHOLD = 5000;
const DELIVERY_FEE       = 300;

const categoryEmoji = (cat: string) =>
  cat === "GPU" ? "🎮" : cat === "CPU" ? "⚡" : cat === "RAM" ? "🧩"
  : cat === "Storage" ? "💾" : cat === "Motherboard" ? "🔌"
  : cat === "PSU" ? "⚙️" : cat === "Cooling" ? "❄️" : "🖥️";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items    = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const loading  = useSelector(selectCartLoading);
  const error    = useSelector(selectCartError);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const shippingFree = subtotal >= SHIPPING_THRESHOLD;
  const shipping     = shippingFree ? 0 : DELIVERY_FEE;
  const vat          = Math.round(subtotal * 0.13);
  const total        = subtotal + shipping + vat;
  const progressPct  = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  if (loading && items.length === 0) {
    return (
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <ShoppingBag size={64} className="text-muted mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-8 max-w-sm">Browse our catalog to find the perfect components.</p>
        <Link href="/products" className={buttonVariants({ size: "lg" })}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Cart</h1>
          <p className="text-muted mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/products" className="text-sm text-muted hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={15} /> Continue Shopping
        </Link>
      </div>

      {error && (
        <div role="alert" className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!shippingFree && (
        <div className="bg-surface border border-border rounded-xl p-4 mb-6">
          <p className="text-sm text-muted mb-2">
            Add <span className="text-white font-semibold">Rs. {(SHIPPING_THRESHOLD - subtotal).toLocaleString()}</span> more for{" "}
            <span className="text-accent font-semibold">free delivery</span>
          </p>
          <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}
              role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      )}
      {shippingFree && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-green-400">
          <Truck size={16} /> You qualify for free delivery!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <article key={item.id}
              className="bg-surface border border-border rounded-xl p-4 flex gap-4 group hover:border-border-hover transition-colors">
              <Link href={`/products/${item.product.id}`} className="shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center text-2xl">
                  {categoryEmoji(item.product.category)}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="muted" className="mb-1">{item.product.category}</Badge>
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="text-sm font-semibold text-white hover:text-accent transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    disabled={loading}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${item.product.name} from cart`}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => dispatch(updateCartItem({ productId: item.product.id, quantity: item.quantity - 1 }))}
                      disabled={loading || item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-surface-hover transition-colors disabled:opacity-40"
                      aria-label="Decrease quantity">−</button>
                    <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(updateCartItem({ productId: item.product.id, quantity: item.quantity + 1 }))}
                      disabled={loading || item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-surface-hover transition-colors disabled:opacity-40"
                      aria-label="Increase quantity">+</button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">Rs. {item.product.price.toLocaleString()} each</div>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <Button variant="ghost" size="sm"
            onClick={() => dispatch(clearCart())}
            disabled={loading}
            className="text-muted hover:text-red-400">
            <Trash2 size={14} /> Clear Cart
          </Button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xl p-5 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal ({items.length} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className={shippingFree ? "text-green-400 font-medium" : ""}>
                  {shippingFree ? "FREE" : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax (13% VAT)</span>
                <span>Rs. {vat.toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-5">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-accent">Rs. {total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted mt-1">Inclusive of all taxes</p>
            </div>
            <Link href="/checkout" className={twMerge(buttonVariants({ size: "lg" }), "w-full justify-center")}>
              Proceed to Checkout <ChevronRight size={16} />
            </Link>
            <div className="mt-5 pt-4 border-t border-border space-y-2.5">
              {[
                { icon: Shield, text: "Secure 256-bit SSL payment" },
                { icon: Truck,  text: "Delivery within 1–3 business days" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted">
                  <Icon size={13} className="text-accent shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

