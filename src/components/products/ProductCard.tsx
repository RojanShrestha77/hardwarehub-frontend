"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store/index";
import type { Product } from "@/lib/api/products";
import { ShoppingCart } from "lucide-react";

const categoryEmoji = (cat: string) =>
  cat === "GPU"          ? "🎮"
  : cat === "CPU"        ? "⚡"
  : cat === "RAM"        ? "🧩"
  : cat === "Storage"    ? "💾"
  : cat === "Motherboard"? "🔌"
  : cat === "PSU"        ? "⚙️"
  : cat === "Cooling"    ? "❄️"
  :                        "🖥️";

const categorySpotlight = (cat: string) =>
  cat === "GPU"          ? "rgba(34,197,94,0.18)"
  : cat === "CPU"        ? "rgba(239,68,68,0.18)"
  : cat === "RAM"        ? "rgba(59,130,246,0.18)"
  : cat === "Storage"    ? "rgba(99,102,241,0.18)"
  : cat === "Motherboard"? "rgba(168,85,247,0.18)"
  : cat === "PSU"        ? "rgba(234,179,8,0.18)"
  : cat === "Cooling"    ? "rgba(251,146,60,0.18)"
  :                        "rgba(161,161,170,0.18)";

interface ProductCardProps { product: Product; }

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const specEntries = product.specs ? Object.entries(product.specs).slice(0, 4) : [];

  const badgeLabel = product.badge
    ? product.badge
    : inStock
    ? "In Stock"
    : "Out of Stock";

  const badgeColor = !inStock
    ? "bg-red-600/90"
    : product.badge
    ? "bg-accent"
    : "bg-green-600/90";

  return (
    <article className="group bg-[#0f0f0f] border border-[#1e1e1e] hover:border-accent/50 transition-all duration-300 flex flex-col overflow-hidden">

      {/* Image / visual area */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div
          className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
          style={{ background: `radial-gradient(ellipse 70% 65% at 50% 30%, ${categorySpotlight(product.category)} 0%, #080808 70%)` }}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 select-none">
              <span className="text-7xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                {categoryEmoji(product.category)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#333]">{product.brand}</span>
            </div>
          )}
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className={`${badgeColor} text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1`}>
              {badgeLabel}
            </span>
          </div>
          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">
                -{discount}%
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        {/* Brand + category */}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] mb-2">
          {product.brand} · {product.category}
        </p>

        {/* Name + price row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-black uppercase tracking-tight text-white leading-snug hover:text-accent transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="shrink-0 text-right">
            <div className="text-base font-black text-accent whitespace-nowrap">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-[10px] text-[#555] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Specs grid */}
        {specEntries.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#1e1e1e] pt-4 mb-5">
            {specEntries.map(([key, val]) => (
              <div key={key}>
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#555] mb-0.5">{key}</div>
                <div className="text-[11px] font-bold text-[#ccc]">{val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/products/${product.id}`}
            className="w-full text-center border border-accent text-accent text-[11px] font-black uppercase tracking-[0.15em] py-2.5 hover:bg-accent hover:text-white transition-colors"
          >
            View Technical Specs
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-accent text-[#888] hover:text-white text-[11px] font-black uppercase tracking-[0.15em] py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-[#2a2a2a] hover:border-accent"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={13} /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden flex flex-col" aria-hidden="true">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-2 w-20 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1e1e1e]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-12 skeleton rounded" />
              <div className="h-3 w-16 skeleton rounded" />
            </div>
          ))}
        </div>
        <div className="h-9 w-full skeleton rounded" />
      </div>
    </div>
  );
}
