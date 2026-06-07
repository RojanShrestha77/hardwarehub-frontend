"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/index";
import { fetchWishlist, removeFromWishlist, clearWishlist, selectWishlistItems, selectWishlistLoading, selectWishlistCount } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const imgSrc = (url: string | null | undefined) =>
  url ? (url.startsWith("http") ? url : `${API_BASE}${url}`) : null;

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items    = useSelector(selectWishlistItems);
  const loading  = useSelector(selectWishlistLoading);
  const count    = useSelector(selectWishlistCount);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-20 flex justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#1e1e1e] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Heart size={28} className="text-accent" /> Wishlist
          </h1>
          <p className="text-[#555] text-sm mt-1">{count} saved item{count !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearWishlist())}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#555] hover:text-red-400 border border-[#222] hover:border-red-400/40 px-4 py-2 transition-colors"
            >
              <Trash2 size={13} /> Clear All
            </button>
          )}
          <Link href="/products" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#555] hover:text-white border border-[#222] px-4 py-2 transition-colors">
            <ArrowLeft size={13} /> Continue Shopping
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={64} className="text-[#333] mb-6" />
          <h2 className="text-xl font-black uppercase text-white mb-2">Your wishlist is empty</h2>
          <p className="text-[#555] text-sm mb-8 max-w-sm">Save items you love and come back to them anytime.</p>
          <Link href="/products" className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const p = typeof item.productId === "string" ? null : item.productId;
            if (!p) return null;
            const id = p._id ?? p.id;
            const inStock = p.stock > 0;
            const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;

            return (
              <article key={id} className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-accent/40 transition-all flex flex-col overflow-hidden group">
                {/* Image */}
                <Link href={`/products/${id}`} className="relative block aspect-[4/3] bg-[#080808] flex items-center justify-center overflow-hidden">
                  {imgSrc(p.imageUrl) ? (
                    <img src={imgSrc(p.imageUrl)!} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package size={48} className="text-[#333] group-hover:text-[#444] transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                  {discount && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-1">-{discount}%</span>
                  )}
                  {!inStock && (
                    <span className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-black uppercase px-2 py-1">Out of Stock</span>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] mb-1">{p.brand} · {p.category}</p>
                  <Link href={`/products/${id}`}>
                    <h3 className="text-sm font-black uppercase text-white hover:text-accent transition-colors line-clamp-2 mb-3">{p.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-base font-black text-accent">Rs. {p.price.toLocaleString()}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-[#555] line-through">Rs. {p.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => { if (inStock) dispatch(addToCart({ productId: id, quantity: 1 })); }}
                      disabled={!inStock}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-wider py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={13} /> {inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button
                      onClick={() => dispatch(removeFromWishlist(id))}
                      className="w-full flex items-center justify-center gap-2 border border-[#222] hover:border-red-400/50 text-[#555] hover:text-red-400 text-[11px] font-black uppercase tracking-wider py-2.5 transition-colors"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
