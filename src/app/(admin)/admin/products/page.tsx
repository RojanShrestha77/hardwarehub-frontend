"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminProducts, deleteAdminProduct, type AdminProduct } from "@/lib/api/admin";
import { Trash2, Search, ChevronLeft, ChevronRight, Star } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const imgSrc = (url: string | null | undefined) =>
  url ? (url.startsWith("http") ? url : `${API_BASE}${url}`) : null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const size = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminProducts(page, size, query || undefined);
      setProducts(res.products);
      setTotal(res.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Products</h1>
          <p className="text-[#555] text-sm mt-1">{total} products listed</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="h-9 pl-8 pr-4 bg-[#0f0f0f] border border-[#222] text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-accent w-56"
            />
          </div>
          <button type="submit" className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-wider transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Product", "Category", "Price", "Stock", "Rating", "Action"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">No products found.</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
                      {imgSrc(p.imageUrl)
                        ? <img src={imgSrc(p.imageUrl)!} alt={p.name} className="w-full h-full object-contain p-1" />
                        : <span className="text-[#333] text-lg">📦</span>}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-[#555]">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-accent">Rs. {p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={p.stock === 0 ? "text-red-400 font-bold" : p.stock < 5 ? "text-yellow-400 font-bold" : "text-[#888]"}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={11} className="fill-yellow-400" />
                    <span className="text-xs text-[#888]">{Number(p.rating ?? 0).toFixed(1)} ({p.reviewCount})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deleting === p.id}
                    className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#555]">Page {page} of {totalPages} · {total} products</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
