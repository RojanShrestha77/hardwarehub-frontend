import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck, Headphones } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { twMerge } from "tailwind-merge";

export const metadata = {
  title: "HardwareHub — Nepal's PC Components Store",
  description: "Shop the latest CPUs, GPUs, RAM, SSDs, and more. Fast delivery across Nepal.",
};

const TRUST_BADGES = [
  { icon: Truck,      label: "Free Delivery",    desc: "On orders over Rs. 5,000" },
  { icon: Shield,     label: "Genuine Products", desc: "100% authentic hardware"  },
  { icon: Zap,        label: "Fast Shipping",    desc: "Same-day in Kathmandu"    },
  { icon: Headphones, label: "Expert Support",   desc: "7 days a week, 9am–7pm"  },
];

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 4);
  const dealProducts     = PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 flex flex-col">

        {/* ── HERO ──────────────────────────────────────── */}
        <section
          className="relative flex items-center min-h-[calc(100svh-64px)] px-4 sm:px-6 overflow-hidden"
          aria-label="Hero"
        >
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#ff6600 1px,transparent 1px),linear-gradient(90deg,#ff6600 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/3 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto w-full py-20">
            <div className="max-w-2xl">
              <Badge variant="accent" className="mb-5">
                🔥 New Arrivals — RTX 5000 Series In Stock
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Build Your Dream{" "}
                <span className="text-accent">PC</span>{" "}
                with Premium{" "}
                <span className="text-accent">Hardware</span>
              </h1>
              <p className="text-muted text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                Nepal&apos;s most trusted PC component store. Genuine products,
                competitive prices, and expert support — from CPU to GPU and everything in between.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/products" className={twMerge(buttonVariants({ size: "lg" }), "inline-flex items-center gap-2")}>
                  Shop All Products <ArrowRight size={18} />
                </Link>
                <Link href="/products?badge=Deal" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                  View Deals
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-border">
                {[
                  { value: "500+", label: "Products"     },
                  { value: "15K+", label: "Customers"    },
                  { value: "98%",  label: "Satisfaction" },
                  { value: "5★",   label: "Rated"        },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-accent">{value}</div>
                    <div className="text-xs text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ──────────────────────────────── */}
        <section className="border-y border-border bg-surface" aria-label="Trust badges">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
              {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-5">
                  <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="text-xs text-muted">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold">Shop by Category</h2>
                <p className="text-muted mt-1">Find exactly what your build needs</p>
              </div>
              <Link href="/products" className="text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1 transition-colors">
                All Products <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <Link key={cat.name} href={`/products?category=${cat.name}`}
                  className="group bg-surface border border-border rounded-xl p-5 hover:border-accent hover:bg-surface-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <div className="font-semibold text-white group-hover:text-accent transition-colors text-sm">{cat.name}</div>
                  <div className="text-xs text-muted mt-0.5">{cat.desc}</div>
                  <div className="text-xs text-muted-dark mt-2">{cat.count} products</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ─────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-surface-2" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <Badge variant="accent" className="mb-2">Handpicked</Badge>
                <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
                <p className="text-muted mt-1">Top picks from our curated collection</p>
              </div>
              <Link href="/products" className="text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ── DEALS ─────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6" aria-labelledby="deals-heading">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-accent/15 via-accent/8 to-transparent border border-accent/20 p-8 sm:p-12 mb-10">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
              <div className="relative">
                <Badge variant="warning" className="mb-4">⚡ Limited Time</Badge>
                <h2 id="deals-heading" className="text-2xl sm:text-4xl font-bold mb-2">Hot Deals This Week</h2>
                <p className="text-muted mb-6 max-w-md">Save up to 25% on top-rated components. Stock is limited — don&apos;t miss out.</p>
                <Link href="/products?badge=Deal" className={twMerge(buttonVariants({ size: "lg" }), "inline-flex items-center gap-2")}>
                  See All Deals <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dealProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ─────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-surface border-t border-border" aria-label="Call to action">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Need Help Choosing the Right Parts?</h2>
            <p className="text-muted mb-6">Our hardware experts are available 7 days a week to help you build the perfect PC for your budget.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className={buttonVariants({ size: "lg" })}>Talk to an Expert</Link>
              <Link href="/products" className={buttonVariants({ variant: "secondary", size: "lg" })}>Browse Products</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
