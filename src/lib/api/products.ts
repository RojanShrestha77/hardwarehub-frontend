import { API } from "./endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  category: string;
  brand: string;
  stock: number;
  rating: string;
  reviewCount: number;
  badge: string | null;
  imageUrl: string | null;
  specs: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Static — cached at build time (product list rarely changes)
export async function getProducts(filters?: {
  search?:   string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:     string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.search)   params.set("search",   filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters?.sort)     params.set("sort",     filters.sort);

  const url = `${BASE_URL}${API.PRODUCTS.LIST}${params.toString() ? `?${params}` : ""}`;

  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to fetch products");

  const json: ProductsResponse = await res.json();
  return json.data ?? [];
}

// ISR — revalidate every 60 seconds
export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}${API.PRODUCTS.DETAIL(id)}`, {
    next: { revalidate: 60, tags: [`product-${id}`, "products"] },
  });
  if (!res.ok) return null;
  const json: ProductResponse = await res.json();
  return json.data ?? null;
}

// Static — for generateStaticParams
export async function getAllProductIds(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}${API.PRODUCTS.IDS}`, {
    cache: "force-cache",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}
