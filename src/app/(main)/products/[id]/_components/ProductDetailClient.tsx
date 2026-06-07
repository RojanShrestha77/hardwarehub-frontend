"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "@/store/slices/wishlistSlice";
import type { AppDispatch, RootState } from "@/store/index";
import type { Product } from "@/lib/api/products";
import { getProductReviews, createReview } from "@/lib/api/reviews";
import type { Review } from "@/lib/api/reviews";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/products/ProductCard";
import { ShoppingCart, ArrowLeft, Check, ChevronRight, Shield, Truck, RotateCcw, Heart, Star, Package } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const imgSrc = (url: string | null) =>
  url ? (url.startsWith("http") ? url : `${API_BASE}${url}`) : null;

interface Props {
  product: Product;
  related: Product[];
}

const categoryEmoji = (cat: string) =>
  cat === "GPU" ? "🎮" : cat === "CPU" ? "⚡" : cat === "RAM" ? "🧩"
  : cat === "Storage" ? "💾" : cat === "Motherboard" ? "🔌"
  : cat === "PSU" ? "⚙️" : cat === "Cooling" ? "❄️" : "🖥️";

const timeAgo = (date: string) => {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30)  return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m < 12)  return `${m} month${m > 1 ? "s" : ""} ago`;
  return `${Math.floor(m / 12)} year${Math.floor(m / 12) > 1 ? "s" : ""} ago`;
};

export function ProductDetailClient({ product, related }: Props) {
  const dispatch   = useDispatch<AppDispatch>();
  const inStock    = product.stock > 0;
  const inWishlist = useSelector((s: RootState) => selectIsInWishlist(product.id)(s));

  const [quantity, setQuantity]       = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab]     = useState<"specs" | "reviews">("specs");

  // Reviews state
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [avgRating, setAvgRating]   = useState(0);
  const [totalReviews, setTotal]    = useState(0);
  const [reviewsLoading, setRLoading] = useState(false);

  // Review form
  const [rating,  setRating]   = useState(5);
  const [comment, setComment]  = useState("");
  const [hovered, setHovered]  = useState(0);
  const [submitting, setSubmit] = useState(false);
  const [submitErr, setErr]    = useState("");
  const [submitOk, setOk]      = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  useEffect(() => {
    if (activeTab !== "reviews") return;
    setRLoading(true);
    getProductReviews(product.id)
      .then((res) => {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
        setTotal(res.data.pagination.total);
      })
      .catch(() => {})
      .finally(() => setRLoading(false));
  }, [activeTab, product.id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (inWishlist) dispatch(removeFromWishlist(product.id));
    else dispatch(addToWishlist(product.id));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) { setErr("Comment must be at least 10 characters."); return; }
    setSubmit(true); setErr("");
    try {
      const res = await createReview(product.id, rating, comment);
      setReviews((p) => [res.data, ...p]);
      setTotal((p) => p + 1);
      setComment(""); setRating(5); setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (e: any) {
      setErr(e.response?.data?.message ?? "Failed to submit review.");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#555] mb-6 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-white line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">

        {/* Image */}
        <div className="space-y-3">
          <div className="aspect-square bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center relative overflow-hidden"
            style={{ background: `radial-gradient(ellipse 70% 70% at 50% 40%, rgba(130,60,5,0.15) 0%, #080808 70%)` }}>
            {imgSrc(product.imageUrl)
              ? <img src={imgSrc(product.imageUrl)!} alt={product.name} className="w-full h-full object-contain p-8" />
              : <span className="text-[120px] select-none opacity-20">{categoryEmoji(product.category)}</span>}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">{product.badge}</span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">-{discount}% OFF</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#555] mb-2">{product.brand} · {product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={Number(product.rating)} count={product.reviewCount} size={15} />
            <button onClick={() => setActiveTab("reviews")} className="text-xs text-[#555] hover:text-accent transition-colors">({totalReviews || product.reviewCount} reviews)</button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-black text-accent">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-lg text-[#555] line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
            {discount && <span className="text-sm font-black text-green-400">Save Rs. {(product.originalPrice! - product.price).toLocaleString()}</span>}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            {inStock
              ? <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-sm text-green-400 font-bold">In Stock — Ships within 24hrs</span></>
              : <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-sm text-red-400 font-bold">Out of Stock</span></>}
          </div>

          {product.description && (
            <p className="text-[#777] text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Quantity + Cart + Wishlist */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center border border-[#222] overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg disabled:opacity-40">−</button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-bold border-x border-[#222]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] py-3 transition-colors disabled:opacity-40">
              {addedToCart ? <><Check size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Cart</>}
            </button>
            <button onClick={handleWishlist}
              className="w-11 h-11 flex items-center justify-center border border-[#222] hover:border-accent transition-colors"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
              <Heart size={18} className={inWishlist ? "fill-accent text-accent" : "text-[#555]"} />
            </button>
          </div>

          <Link href="/cart"
            className="w-full flex items-center justify-center gap-2 border border-[#333] hover:border-accent text-[#aaa] hover:text-white font-black uppercase text-[11px] tracking-[0.15em] py-3 transition-colors mb-6">
            Buy Now
          </Link>

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-[#1e1e1e]">
            {[{ icon: Shield, label: "Genuine Product" }, { icon: Truck, label: "Fast Delivery" }, { icon: RotateCcw, label: "15-Day Returns" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center"><Icon size={16} className="text-accent" /></div>
                <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs / Reviews Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-[#1e1e1e] mb-6">
          {(["specs", "reviews"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={twMerge("px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] border-b-2 transition-colors -mb-px",
                activeTab === tab ? "border-accent text-accent" : "border-transparent text-[#555] hover:text-white")}>
              {tab === "reviews" ? `Reviews (${totalReviews || product.reviewCount})` : "Specifications"}
            </button>
          ))}
        </div>

        {/* Specs */}
        {activeTab === "specs" && (
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
            {product.specs && Object.entries(product.specs).length > 0
              ? Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={key} className={`grid grid-cols-2 sm:grid-cols-3 px-5 py-3.5 text-sm ${idx % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#0a0a0a]"}`}>
                    <span className="text-[#555] font-black uppercase text-[10px] tracking-[0.1em]">{key}</span>
                    <span className="text-white sm:col-span-2">{value}</span>
                  </div>
                ))
              : <p className="px-5 py-8 text-[#555] text-sm text-center">No specifications available.</p>}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">

            {/* Summary */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-6 bg-[#0f0f0f] border border-[#1e1e1e] p-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-white">{avgRating.toFixed(1)}</div>
                  <StarRating rating={avgRating} size={14} className="justify-center mt-1" />
                  <div className="text-[#555] text-xs mt-1">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</div>
                </div>
              </div>
            )}

            {/* Submit form */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">Write a Review</h3>
              {submitOk && (
                <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm">Review submitted successfully!</div>
              )}
              {submitErr && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{submitErr}</div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star picker */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#555] mb-2">Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button"
                        onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(s)}>
                        <Star size={24} className={`transition-colors ${s <= (hovered || rating) ? "fill-accent text-accent" : "text-[#333]"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#555] mb-2">Comment * (min 10 chars)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this product…"
                    className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#222] text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                  <p className="text-[10px] text-[#444] mt-1">{comment.length} / 500</p>
                </div>
                <button type="submit" disabled={submitting}
                  className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3 transition-colors disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            </div>

            {/* Review list */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8"><span className="h-6 w-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" /></div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-[#555]">
                <Star size={40} className="mx-auto mb-3 text-[#222]" />
                <p className="text-sm">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <article key={r._id} className="bg-[#0f0f0f] border border-[#1e1e1e] p-5">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div>
                        <p className="font-black text-sm text-white">{r.userId?.name ?? r.userId?.username ?? "Anonymous"}</p>
                        <p className="text-[10px] text-[#444] mt-0.5">{timeAgo(r.createdAt)}</p>
                      </div>
                      <StarRating rating={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-[#888] leading-relaxed">{r.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-5">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
