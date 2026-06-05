"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import type { Product } from "@/lib/mock-data";
import { REVIEWS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { buttonVariants } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { ShoppingCart, ArrowLeft, Check, ChevronRight, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: Props) {
  const dispatch = useDispatch();
  const [quantity, setQuantity]       = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab]     = useState<"specs" | "reviews">("specs");

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const categoryEmoji =
    product.category === "GPU"         ? "🎮"
  : product.category === "CPU"         ? "⚡"
  : product.category === "RAM"         ? "🧩"
  : product.category === "Storage"     ? "💾"
  : product.category === "Motherboard" ? "🔌"
  : product.category === "PSU"         ? "⚙️"
  : product.category === "Cooling"     ? "❄️"
  :                                      "🖥️";

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.color, category: product.category }));
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-white line-clamp-1">{product.name}</span>
      </nav>

      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors mb-6">
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">

        {/* Image */}
        <div className="space-y-3">
          <div className={`aspect-square rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center relative overflow-hidden border border-border`}>
            <div className="text-[120px] select-none opacity-20">{categoryEmoji}</div>
            {product.badge && <div className="absolute top-4 left-4"><Badge variant="accent">{product.badge}</Badge></div>}
            {discount && <div className="absolute top-4 right-4"><Badge variant="success">-{discount}% OFF</Badge></div>}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-20 h-20 rounded-lg bg-gradient-to-br ${product.color} border-2 ${i === 1 ? "border-accent" : "border-border"} flex items-center justify-center text-2xl opacity-60 cursor-pointer hover:opacity-100 transition-opacity`}>
                {categoryEmoji}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted">
            <span>{product.brand}</span><span>·</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{product.name}</h1>
          <div className="mb-4"><StarRating rating={product.rating} count={product.reviewCount} size={16} /></div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                <Badge variant="success">Save Rs. {(product.originalPrice - product.price).toLocaleString()}</Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-sm text-green-400 font-medium">In Stock — Ships within 24hrs</span></>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-sm text-red-400 font-medium">Out of Stock</span></>
            )}
          </div>

          <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-muted hover:text-white hover:bg-surface transition-colors text-lg" disabled={quantity <= 1} aria-label="Decrease quantity">−</button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-border">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-white hover:bg-surface transition-colors text-lg" aria-label="Increase quantity">+</button>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={!product.inStock} className="flex-1">
              {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </Button>
          </div>

          <Link href="/cart" className={twMerge(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center mb-6")}>
            Buy Now
          </Link>

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-border">
            {[{ icon: Shield, label: "Genuine Product" }, { icon: Truck, label: "Fast Delivery" }, { icon: RotateCcw, label: "15-Day Returns" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-9 h-9 rounded-lg bg-accent-muted flex items-center justify-center"><Icon size={16} className="text-accent" /></div>
                <span className="text-xs text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs / Reviews Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-6" role="tablist">
          {(["specs", "reviews"] as const).map((tab) => (
            <button key={tab} role="tab" aria-selected={activeTab === tab} aria-controls={`tabpanel-${tab}`} onClick={() => setActiveTab(tab)}
              className={twMerge("px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px",
                activeTab === tab ? "border-accent text-accent" : "border-transparent text-muted hover:text-white")}>
              {tab === "reviews" ? `Reviews (${REVIEWS.length})` : "Specifications"}
            </button>
          ))}
        </div>

        <div id="tabpanel-specs" role="tabpanel" hidden={activeTab !== "specs"}>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {Object.entries(product.specs).map(([key, value], idx) => (
              <div key={key} className={twMerge("grid grid-cols-2 sm:grid-cols-3 px-5 py-3.5 text-sm", idx % 2 === 0 ? "bg-surface" : "bg-surface-hover")}>
                <span className="text-muted font-medium">{key}</span>
                <span className="text-white sm:col-span-2">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="tabpanel-reviews" role="tabpanel" hidden={activeTab !== "reviews"}>
          <div className="space-y-4">
            {REVIEWS.map((review) => (
              <article key={review.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{review.author}</div>
                    <div className="text-xs text-muted mt-0.5">{review.date}</div>
                  </div>
                  <StarRating rating={review.rating} size={13} />
                </div>
                <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold mb-5">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
