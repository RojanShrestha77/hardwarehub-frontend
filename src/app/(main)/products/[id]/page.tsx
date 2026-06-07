// SERVER COMPONENT — no "use client"
// Demonstrates three advanced data fetching patterns:
//   1. generateStaticParams   → pre-renders all product pages at build time
//   2. revalidate: 60         → ISR — stale page re-generated every 60 seconds
//   3. dynamicParams: true    → new product IDs not in generateStaticParams are
//                               rendered on-demand and cached (fallback: 'blocking')

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductById, getAllProductIds } from "@/lib/api/products";
import { ProductDetailClient } from "./_components/ProductDetailClient";
import { getProducts } from "@/lib/api/products";

// ─── ISR: Revalidate every 60 seconds ────────────────────────────────────────
// After 60s, the next visitor gets a fresh re-generated page.
// Equivalent to getStaticProps({ revalidate: 60 }) in the Pages Router.
export const revalidate = 60;

// ─── Allow on-demand generation for new products ──────────────────────────────
// If a product ID is NOT in generateStaticParams, render it on-demand and cache.
export const dynamicParams = true;

// ─── Pre-render all known product pages at build time ────────────────────────
// Next.js calls this at build time to know which [id] values to pre-render.
// Result: /products/1, /products/2, ... are all static HTML at deploy time.
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id }));
}

// ─── Dynamic metadata per product ────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Uses next: { revalidate: 60 } inside getProductById — but since the page-level
  // revalidate: 60 is set above, this is also automatically revalidated.
  const product = await getProductById(id);

  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    // Suspense allows the page shell to stream while slow parts (reviews etc.) load
    <Suspense fallback={<div className="h-screen" />}>
      <ProductDetailClient product={product} related={related} />
    </Suspense>
  );
}
