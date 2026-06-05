// SERVER COMPONENT — no "use client"
// Fetches data at request time using fetch() with cache: 'force-cache'.
// Next.js automatically shows loading.tsx while this page streams in.

import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { ProductsClient } from "./_components/ProductsClient";
import { ProductCardSkeleton } from "@/components/products/ProductCard";

export const metadata = {
  title: "All Products",
  description: "Browse CPUs, GPUs, RAM, SSDs and more at HardwareHub.",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string; badge?: string }>;
}

// ─── Server Component ────────────────────────────────────────────────────────
// This runs on the server. `getProducts()` uses cache:'force-cache' so the
// product list is cached at build time and never hits the API on every request.
// When the cache is stale, Next.js re-fetches in the background (ISR).
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // fetch() with force-cache — cached at build time, never re-fetches unless
  // revalidated. Shows how RSC replaces getStaticProps from the Pages Router.
  const products = await getProducts();

  return (
    // Suspense boundary: if a child component suspends (slow data fetch),
    // the fallback is shown instead of blocking the whole page.
    <Suspense fallback={<ProductsGridSkeleton />}>
      <ProductsClient
        initialProducts={products}
        initialSearch={params.search ?? ""}
        initialCategory={params.category ?? ""}
      />
    </Suspense>
  );
}

// Inline fallback for the Suspense boundary inside this server component
function ProductsGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-8 w-40 skeleton rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
