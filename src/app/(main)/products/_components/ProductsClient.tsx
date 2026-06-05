"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from "lucide-react";
import type { Product } from "@/lib/api/products";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { twMerge } from "tailwind-merge";

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured"       },
  { value: "price-asc",  label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "rating",     label: "Highest Rated"  },
];

const PRICE_RANGES = [
  { label: "Under Rs. 10,000",     min: 0,      max: 10000   },
  { label: "Rs. 10,000 – 30,000",  min: 10000,  max: 30000   },
  { label: "Rs. 30,000 – 60,000",  min: 30000,  max: 60000   },
  { label: "Rs. 60,000 – 100,000", min: 60000,  max: 100000  },
  { label: "Over Rs. 100,000",     min: 100000, max: Infinity },
];

interface ProductsClientProps {
  initialProducts: Product[];
  initialSearch?: string;
  initialCategory?: string;
}

export function ProductsClient({ initialProducts, initialSearch = "", initialCategory = "" }: ProductsClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly]   = useState(false);
  const [sortBy, setSortBy]             = useState("featured");
  const [searchQuery, setSearchQuery]   = useState(initialSearch);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }
    switch (sortBy) {
      case "price-asc":  result.sort((a, b) => a.price - b.price);   break;
      case "price-desc": result.sort((a, b) => b.price - a.price);   break;
      case "rating":     result.sort((a, b) => Number(b.rating) - Number(a.rating)); break;
    }
    return result;
  }, [initialProducts, searchQuery, selectedCategories, selectedPriceRange, inStockOnly, sortBy]);

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedCategories.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  function Sidebar() {
    return (
      <aside className="w-full space-y-6" aria-label="Product filters">

        {/* Search */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.15em] text-white block mb-2">Search</label>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Brand, model…"
            className="w-full h-9 px-3 bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-accent transition-all"
            aria-label="Search products"
          />
        </div>

        {/* Category */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="w-4 h-4 border-[#333] bg-[#111] accent-accent cursor-pointer"
                />
                <span className="text-sm text-[#888] group-hover:text-white transition-colors flex-1">
                  {cat.name}
                </span>
                <span className="text-xs text-[#444]">{cat.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white mb-3">Price Range</h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="price-range"
                  checked={selectedPriceRange === idx}
                  onChange={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                  className="w-4 h-4 border-[#333] bg-[#111] accent-accent cursor-pointer"
                />
                <span className="text-sm text-[#888] group-hover:text-white transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 border-[#333] bg-[#111] accent-accent cursor-pointer"
            />
            <span className="text-sm text-[#888] group-hover:text-white transition-colors font-medium">
              In Stock Only
            </span>
          </label>
        </div>

        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="w-full flex items-center justify-center gap-1.5 border border-[#333] hover:border-accent text-[#555] hover:text-accent text-[11px] font-black uppercase tracking-wider py-2 transition-colors">
            <X size={12} /> Clear filters ({activeFilterCount})
          </button>
        )}
      </aside>
    );
  }

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page header ── */}
      <div className="border-b border-[#1e1e1e] pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {selectedCategories.length === 1 ? selectedCategories[0] : "All"} Products
            </h1>
            <p className="text-[#555] text-sm mt-1">
              Precision-engineered equipment for high-demand applications.
            </p>
          </div>
          <p className="text-sm text-[#555] shrink-0">
            Showing <span className="text-accent font-bold">{filteredProducts.length}</span> Products
          </p>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4" role="list" aria-label="Active filters">
            {selectedCategories.map((cat) => (
              <button key={cat} role="listitem" onClick={() => toggleCategory(cat)}
                className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#1a1a1a] border border-accent/40 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all">
                {cat} <X size={11} />
              </button>
            ))}
            {selectedPriceRange !== null && (
              <button role="listitem" onClick={() => setSelectedPriceRange(null)}
                className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#1a1a1a] border border-accent/40 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all">
                {PRICE_RANGES[selectedPriceRange].label} <X size={11} />
              </button>
            )}
            {inStockOnly && (
              <button role="listitem" onClick={() => setInStockOnly(false)}
                className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#1a1a1a] border border-accent/40 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all">
                In Stock <X size={11} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24"><Sidebar /></div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <Button variant="secondary" size="sm" className="lg:hidden"
              onClick={() => setSidebarOpen(true)} aria-expanded={sidebarOpen}>
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && <Badge variant="accent" className="ml-1">{activeFilterCount}</Badge>}
            </Button>

            <div className="relative ml-auto">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="h-9 pl-3 pr-8 bg-surface border border-border rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                aria-label="Sort products">
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>

            <div className="flex border border-border rounded-md overflow-hidden">
              {(["grid", "list"] as const).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={twMerge("w-9 h-9 flex items-center justify-center transition-colors",
                    viewMode === mode ? "bg-accent text-white" : "text-muted hover:text-white hover:bg-surface")}
                  aria-label={`${mode} view`} aria-pressed={viewMode === mode}>
                  {mode === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted text-sm mb-6">Try adjusting your search or filters</p>
              <Button variant="secondary" onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className={twMerge(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-4"
            )}>
              {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-surface-2 border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface-2">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-white hover:bg-surface transition-colors"
                aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <div className="p-4"><Sidebar /></div>
            <div className="p-4 border-t border-border sticky bottom-0 bg-surface-2">
              <Button className="w-full" onClick={() => setSidebarOpen(false)}>
                Show {filteredProducts.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

