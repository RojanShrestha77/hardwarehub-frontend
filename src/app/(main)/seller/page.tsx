"use client";

import { useEffect, useState } from "react";
import type { Product, SellerProductData } from "@/lib/api/seller";
import { Plus, Edit, Trash2, Package, DollarSign, Loader2 } from "lucide-react";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/products", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch products");
      const data = json.data ?? [];
      setProducts(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete product");
      }
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
          <p className="text-muted mt-1">Manage your products</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Package className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-muted text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-muted text-sm">In Stock</p>
              <p className="text-2xl font-bold text-white">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Package className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-muted text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-white">
                {products.filter(p => p.stock < 10).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-lg">
          <Package className="w-16 h-16 mx-auto text-muted mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
          <p className="text-muted mb-4">Create your first product to start selling</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white">Category</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={`http://localhost:5000${product.imageUrl}`} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#0a0a0a] rounded flex items-center justify-center">
                            <Package size={20} className="text-muted" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted line-through">₹{product.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-500/10 text-red-400' :
                        product.stock < 10 ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-green-500/10 text-green-400'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 hover:bg-accent/10 text-accent rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={closeForm}
          onSuccess={() => {
            closeForm();
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

// Product Form Modal Component
function ProductFormModal({ 
  product, 
  onClose, 
  onSuccess 
}: { 
  product: Product | null; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState<SellerProductData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || undefined,
    category: product?.category || "",
    brand: product?.brand || "",
    stock: product?.stock || 0,
    badge: product?.badge || "",
    imageUrl: product?.imageUrl || "",
    specs: product?.specs || {},
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        // imageUrl is backend-computed from the uploaded file; never send it
        if (key === "imageUrl") return;

        if (key === "specs") {
          // Only send specs if there's actual content; skip empty objects
          if (value && typeof value === "object" && Object.keys(value).length > 0) {
            submitData.append(key, JSON.stringify(value));
          }
          return;
        }

        if (value !== undefined && value !== null && value !== "") {
          submitData.append(key, String(value));
        }
      });

      // Add image file if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const url = product
        ? `/api/seller/products/${product.id}`
        : "/api/seller/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: submitData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save product");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full h-10 px-3 bg-[#0a0a0a] border border-border rounded-md text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-1.5">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={inputClass}
                placeholder="e.g., Intel Core i9-13900K"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className={inputClass}
                placeholder="e.g., Intel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={inputClass}
                placeholder="e.g., CPU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price || ""}
                onChange={(e) => setFormData({...formData, price: e.target.value === "" ? 0 : Number(e.target.value)})}
                className={inputClass}
                placeholder="e.g. 1500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice || ""}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined})}
                className={inputClass}
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock || ""}
                onChange={(e) => setFormData({...formData, stock: e.target.value === "" ? 0 : Number(e.target.value)})}
                className={inputClass}
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Badge</label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) => setFormData({...formData, badge: e.target.value})}
                className={inputClass}
                placeholder="e.g., Best Seller"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-1.5">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover file:cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border border-border" />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-1.5">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Product description..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 px-4 bg-[#0a0a0a] hover:bg-[#151515] text-white rounded-md transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-10 px-4 bg-accent hover:bg-accent-hover text-white rounded-md transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
