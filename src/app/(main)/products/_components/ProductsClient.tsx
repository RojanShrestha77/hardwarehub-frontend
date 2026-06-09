"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/api/products";
import type { Category } from "@/lib/api/categories";
import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  initialProducts: Product[];
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
}

export function ProductsClient({
  initialProducts,
  categories,
  initialSearch,
  initialCategory,
}: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  const filtered = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory) {
      list = list.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          categories.find((c) => c.slug === selectedCategory)?.name.toLowerCase() === p.category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));

    return list;
  }, [initialProducts, search, selectedCategory, sortBy, categories]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          All Products
        </h1>
        <p className="text-[#666] text-sm mt-1">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-[#222] text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-[#111] border border-[#222] text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer min-w-40"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 bg-[#111] border border-[#222] text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-[#555]">
          <p className="text-lg font-bold">No products found.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
