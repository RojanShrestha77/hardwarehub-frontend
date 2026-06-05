"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store/index";
import type { Product } from "@/lib/api/products";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ShoppingCart } from "lucide-react";

const categoryEmoji = (cat: string) =>
  cat === "GPU"         ? "🎮"
  : cat === "CPU"       ? "⚡"
  : cat === "RAM"       ? "🧩"
  : cat === "Storage"   ? "💾"
  : cat === "Motherboard" ? "🔌"
  : cat === "PSU"       ? "⚙️"
  : cat === "Cooling"   ? "❄️"
  :                       "🖥️";

const categoryGradient = (cat: string) =>
  cat === "GPU"         ? "from-green-900 to-green-700"
  : cat === "CPU"       ? "from-red-900 to-red-700"
  : cat === "RAM"       ? "from-blue-900 to-blue-700"
  : cat === "Storage"   ? "from-indigo-900 to-indigo-700"
  : cat === "Motherboard" ? "from-purple-900 to-purple-700"
  : cat === "PSU"       ? "from-yellow-900 to-yellow-700"
  : cat === "Cooling"   ? "from-amber-900 to-amber-700"
  :                       "from-zinc-900 to-zinc-700";

interface ProductCardProps { product: Product; }

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const inStock = product.stock > 0;

  return (
    <article className="group relative bg-surface border border-border rounded-xl overflow-hidden hover:border-border-hover transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 flex flex-col">
      <Link href={`/products/${product.id}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${categoryGradient(product.category)} flex items-center justify-center overflow-hidden`}>
          <div className="text-5xl select-none opacity-30 group-hover:opacity-40 transition-opacity">
            {categoryEmoji(product.category)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && <Badge variant="accent">{product.badge}</Badge>}
            {discount && <Badge variant="success">-{discount}%</Badge>}
            {!inStock && <Badge variant="danger">Out of Stock</Badge>}
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="text-xs text-muted font-medium uppercase tracking-wider mb-1">
          {product.brand} · {product.category}
        </div>
        <Link href={`/products/${product.id}`} className="group/title">
          <h3 className="text-sm font-semibold text-white leading-snug mb-2 group-hover/title:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={Number(product.rating)} count={product.reviewCount} size={13} />
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-white">Rs. {product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-xs text-muted line-through">Rs. {product.originalPrice.toLocaleString()}</div>
            )}
          </div>
          <Button size="sm" onClick={handleAddToCart} disabled={!inStock} aria-label={`Add ${product.name} to cart`} className="shrink-0">
            <ShoppingCart size={14} /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col" aria-hidden="true">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-20 skeleton rounded" />
        <div className="flex justify-between items-end pt-1">
          <div className="h-6 w-28 skeleton rounded" />
          <div className="h-8 w-16 skeleton rounded-md" />
        </div>
      </div>
    </div>
  );
}
