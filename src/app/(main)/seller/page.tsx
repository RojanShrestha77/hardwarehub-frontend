"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product, SellerProductData } from "@/lib/api/seller";
import {
  getMyProductsAction,
  handleCreateProduct,
  handleUpdateProduct,
  deleteProductAction,
} from "@/lib/actions/seller/product.action";
import { getAllCategories, type Category } from "@/lib/api/categories";
import {
  Plus, Edit2, Trash2, Package, TrendingDown,
  AlertTriangle, X, Upload, Star, Layers, Loader2, Store,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
const imgSrc = (url: string | null | undefined) =>
  url ? (url.startsWith("http") ? url : `${API_BASE}${url}`) : null;

// ── Dashboard page ────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const { user }                = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMyProductsAction();
      if (!r.success) throw new Error(r.message);
      setProducts(r.data ?? []);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const r = await deleteProductAction(id);
      if (!r.success) throw new Error(r.message);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openNew   = ()           => { setEditing(null); setShowForm(true); };
  const openEdit  = (p: Product) => { setEditing(p);    setShowForm(true); };
  const closeForm = ()           => { setShowForm(false); setEditing(null); };

  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const lowStock   = products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const outStock   = products.filter((p) => p.stock === 0).length;

  const STATS = [
    { label: "Total Listings", value: products.length, Icon: Layers,        color: "text-accent",     bg: "bg-accent/10"     },
    { label: "Total Units",    value: totalUnits,       Icon: Package,       color: "text-blue-400",   bg: "bg-blue-400/10"   },
    { label: "Low Stock",      value: lowStock,         Icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Out of Stock",   value: outStock,         Icon: TrendingDown,  color: "text-red-400",    bg: "bg-red-400/10"    },
  ];

  if (loading) return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex justify-center">
      <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#1e1e1e] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Store size={26} className="text-accent" />
            Seller Dashboard
          </h1>
          <p className="text-[#555] text-sm mt-1">
            Welcome back,{" "}
            <span className="text-white font-bold">{user?.name ?? "Seller"}</span>
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-[0.15em] px-5 py-3 transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-[#0f0f0f] border border-[#1e1e1e] p-5 flex items-center gap-4">
            <div className={`w-11 h-11 flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#555] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products table */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0f0f0f] border border-[#1e1e1e] text-center">
          <Package size={56} className="text-[#333] mb-5" />
          <h3 className="text-xl font-black uppercase text-white mb-2">No products yet</h3>
          <p className="text-[#555] text-sm mb-6">Create your first listing to start selling.</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-[0.15em] px-6 py-3 transition-colors"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>
      ) : (
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1e1e1e]">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
              My Products <span className="text-accent ml-1">({products.length})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#161616]">
                  {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {products.map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={openEdit} onDelete={confirmDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editing}
          onClose={closeForm}
          onSuccess={() => { closeForm(); load(); }}
        />
      )}
    </div>
  );
}

// ── Product table row ─────────────────────────────────────────────────────────

function ProductRow({
  product: p,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <tr className="hover:bg-[#111] transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1a1a1a] border border-[#222] flex items-center justify-center shrink-0 overflow-hidden">
            {imgSrc(p.imageUrl)
              ? <img src={imgSrc(p.imageUrl)!} alt={p.name} className="w-full h-full object-contain p-1" />
              : <Package size={18} className="text-[#333]" />}
          </div>
          <div>
            <p className="font-bold text-white text-sm line-clamp-1 max-w-[200px]">{p.name}</p>
            <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider mt-0.5">{p.brand}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]">
          {p.category}
        </span>
      </td>
      <td className="px-5 py-4">
        <p className="font-black text-accent">Rs. {p.price.toLocaleString()}</p>
        {p.originalPrice && (
          <p className="text-[10px] text-[#555] line-through mt-0.5">Rs. {p.originalPrice.toLocaleString()}</p>
        )}
      </td>
      <td className="px-5 py-4">
        <span className={twMerge(
          "text-[10px] font-black uppercase tracking-wider px-2 py-1 border",
          p.stock === 0
            ? "text-red-400 bg-red-400/10 border-red-400/30"
            : p.stock < 5
            ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
            : "text-green-400 bg-green-400/10 border-green-400/30"
        )}>
          {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-[#888]">
            {Number(p.rating ?? 0).toFixed(1)} ({p.reviewCount ?? 0})
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(p)}
            className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider border border-accent/30 text-accent hover:bg-accent hover:text-white transition-colors"
          >
            <Edit2 size={11} /> Edit
          </button>
          <button
            onClick={() => onDelete(p.id, p.name)}
            className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Product Form Modal ────────────────────────────────────────────────────────

const FORM_ID = "seller-product-form";

function ProductFormModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<SellerProductData>({
    name:          product?.name          ?? "",
    description:   product?.description   ?? "",
    price:         product?.price         ?? 0,
    originalPrice: product?.originalPrice ?? undefined,
    category:      product?.category      ?? "",
    brand:         product?.brand         ?? "",
    stock:         product?.stock         ?? 0,
    badge:         product?.badge         ?? "",
    imageUrl:      product?.imageUrl      ?? "",
    specs:         product?.specs         ?? {},
  });

  const [categories, setCategories]     = useState<Category[]>([]);
  const [catLoading, setCatLoading]     = useState(true);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.imageUrl ? (imgSrc(product.imageUrl) ?? "") : ""
  );
  const [specKey, setSpecKey]     = useState("");
  const [specVal, setSpecVal]     = useState("");
  const [submitting, setSubmit]   = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getAllCategories()
      .then((res: any) => {
        const list: Category[] = Array.isArray(res) ? res : (res?.data ?? []);
        setCategories(list);
        if (!product && !form.category && list.length > 0) {
          setForm((f) => ({ ...f, category: list[0].name }));
        }
      })
      .catch(() => {})
      .finally(() => setCatLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = <K extends keyof SellerProductData>(k: K, v: SellerProductData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFormError("Select a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { setFormError("Image must be under 5 MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  };

  const addSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setField("specs", { ...(form.specs ?? {}), [specKey.trim()]: specVal.trim() });
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpec = (key: string) => {
    const next = { ...(form.specs ?? {}) };
    delete next[key];
    setField("specs", next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmit(true);
    try {
      const fd = new FormData();
      (Object.entries(form) as [string, any][]).forEach(([k, v]) => {
        if (k === "imageUrl") return;
        if (k === "specs") {
          if (v && Object.keys(v).length > 0) fd.append(k, JSON.stringify(v));
          return;
        }
        if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
      });
      if (imageFile) fd.append("image", imageFile);

      const r = product
        ? await handleUpdateProduct(product.id, fd)
        : await handleCreateProduct(fd);

      if (!r.success) throw new Error(r.message);
      onSuccess();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmit(false);
    }
  };

  const inputCls =
    "w-full h-10 px-3 bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f0f] border border-[#222] w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] shrink-0">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form body — linked by FORM_ID */}
        <form
          id={FORM_ID}
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 px-6 py-5 space-y-5"
        >
          {formError && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {formError}
            </div>
          )}

          {/* Basic Info */}
          <Section label="Basic Info">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Product Name *</Label>
                <input
                  required type="text" value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputCls} placeholder="e.g., Bosch GSB 550 Impact Drill"
                />
              </div>
              <div>
                <Label>Brand *</Label>
                <input
                  required type="text" value={form.brand}
                  onChange={(e) => setField("brand", e.target.value)}
                  className={inputCls} placeholder="e.g., Bosch"
                />
              </div>
              <div>
                <Label>Category *</Label>
                {catLoading ? (
                  <div className={`${inputCls} flex items-center gap-2 text-[#555]`}>
                    <Loader2 size={13} className="animate-spin" /> Loading…
                  </div>
                ) : (
                  <select
                    required value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section label="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Selling Price (Rs.) *</Label>
                <input
                  required type="number" min="1"
                  value={form.price || ""}
                  onChange={(e) => setField("price", e.target.value === "" ? 0 : Number(e.target.value))}
                  className={inputCls} placeholder="e.g., 4500"
                />
              </div>
              <div>
                <Label>Original Price (Rs.) <span className="text-[#444] normal-case font-normal">optional</span></Label>
                <input
                  type="number" min="0"
                  value={form.originalPrice ?? ""}
                  onChange={(e) => setField("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
                  className={inputCls} placeholder="e.g., 5200"
                />
              </div>
            </div>
          </Section>

          {/* Inventory */}
          <Section label="Inventory">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Quantity *</Label>
                <input
                  required type="number" min="0"
                  value={form.stock === 0 ? "" : form.stock}
                  onChange={(e) => setField("stock", e.target.value === "" ? 0 : Number(e.target.value))}
                  className={inputCls} placeholder="e.g., 25"
                />
              </div>
              <div>
                <Label>Badge <span className="text-[#444] normal-case font-normal">optional</span></Label>
                <input
                  type="text" value={form.badge ?? ""}
                  onChange={(e) => setField("badge", e.target.value)}
                  className={inputCls} placeholder="e.g., Best Seller"
                />
              </div>
            </div>
          </Section>

          {/* Description */}
          <Section label="Description">
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className={`${inputCls} h-auto resize-none py-2.5`}
              placeholder="Describe the product's key features and use cases…"
            />
          </Section>

          {/* Image */}
          <Section label="Product Image">
            <label className="flex items-center gap-3 border border-dashed border-[#333] hover:border-accent px-4 py-4 cursor-pointer transition-colors group">
              <Upload size={18} className="text-[#555] group-hover:text-accent transition-colors shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[#888] group-hover:text-white transition-colors">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </p>
                <p className="text-[10px] text-[#444] mt-0.5">PNG, JPG, WEBP · max 5 MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {imagePreview && (
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={imagePreview} alt="Preview"
                  className="w-20 h-20 object-contain bg-[#1a1a1a] border border-[#222] p-1"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(""); }}
                  className="text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </Section>

          {/* Specs */}
          <Section label="Specifications">
            {Object.entries(form.specs ?? {}).length > 0 && (
              <div className="border border-[#1e1e1e] divide-y divide-[#1e1e1e] mb-3">
                {Object.entries(form.specs ?? {}).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#555] w-28 shrink-0 truncate">{k}</span>
                      <span className="text-sm text-white truncate">{v}</span>
                    </div>
                    <button
                      type="button" onClick={() => removeSpec(k)}
                      className="ml-4 text-[#444] hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text" value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className={`${inputCls} flex-1`} placeholder="Attribute (e.g., Power)"
              />
              <input
                type="text" value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpec(); } }}
                className={`${inputCls} flex-1`} placeholder="Value (e.g., 550W)"
              />
              <button
                type="button" onClick={addSpec}
                className="h-10 px-4 bg-[#1a1a1a] border border-[#333] hover:border-accent text-[#888] hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <p className="text-[10px] text-[#444] mt-1.5">Press Enter or click Add to save each spec</p>
          </Section>
        </form>

        {/* Footer — submit button linked to form via html `form` attribute */}
        <div className="px-6 py-4 border-t border-[#1e1e1e] flex gap-3 shrink-0">
          <button
            type="button" onClick={onClose} disabled={submitting}
            className="flex-1 h-10 border border-[#333] text-[#777] hover:text-white hover:border-[#555] text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={submitting}
            className="flex-1 h-10 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting
              ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
              : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
      {children}
    </label>
  );
}
