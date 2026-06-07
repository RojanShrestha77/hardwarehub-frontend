import Link from "next/link";
import { ArrowRight, Tag, Wrench } from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { CountdownTimer } from "@/components/home/CountdownTimer";

export const metadata = {
  title: "HardwareHub — Professional Tools & Hardware",
  description: "Industrial-grade tools for professional contractors.",
};

const STATS = [
  { value: "500k+", label: "Tools in Stock"   },
  { value: "24/7",  label: "Field Support"    },
  { value: "NBD",   label: "Next Day Delivery"},
  { value: "10yr",  label: "Core Warranty"    },
];

const CATEGORY_CONFIGS = [
  { bg: "radial-gradient(ellipse 90% 80% at 70% 35%,#6b2d00 0%,#2d1200 45%,#080300 100%)", badge: "Bestseller", cta: "Shop Now"      },
  { bg: "radial-gradient(ellipse 90% 80% at 70% 35%,#1c2a3a 0%,#0d1520 45%,#030608 100%)", badge: null,         cta: "Explore Range" },
  { bg: "radial-gradient(ellipse 90% 80% at 70% 35%,#3a2e00 0%,#1a1400 45%,#060400 100%)", badge: null,         cta: "View Supply"   },
  { bg: "radial-gradient(ellipse 90% 80% at 70% 35%,#0a1e30 0%,#060f18 45%,#020406 100%)", badge: null,         cta: "Get a Quote"   },
];

const TOP_TRADES = [
  { name: "Power Tools",    icon: "⚡", slug: "power-tools"    },
  { name: "Hand Tools",     icon: "🔨", slug: "hand-tools"     },
  { name: "Electrical",     icon: "🔌", slug: "electrical-tools"},
  { name: "Plumbing",       icon: "🪠", slug: "plumbing-tools" },
  { name: "Woodworking",    icon: "🪵", slug: "woodworking-tools"},
  { name: "Automotive",     icon: "🔧", slug: "automotive-tools"},
];

const inner = "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6";

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const dealProducts = allProducts.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="flex flex-col">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-black">

          {/* background image — man positioned right, shifted up to show head */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/hero-bg.png')", backgroundPosition: "80% 8%" }}
          />
          {/* gradient: black left for text, reveals man center-right, hard black at far right edge */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right,#000 0%,#000 32%,rgba(0,0,0,0.75) 48%,rgba(0,0,0,0.1) 65%,rgba(0,0,0,0.7) 85%,#000 100%)" }}
          />
          {/* warm amber glow behind man */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 40% 65% at 72% 50%,rgba(130,60,5,0.4) 0%,transparent 65%)" }}
          />

          {/* text content */}
          <div className={`relative z-10 ${inner} py-36`}>
            <span className="inline-block bg-accent text-white text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 mb-7">
              Industrial Grade
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black uppercase leading-[1.0] tracking-tight mb-6">
              Tools that<br />
              <span className="text-accent">outlast</span> the job.
            </h1>
            <p className="text-[#aaa] text-base sm:text-lg max-w-md leading-relaxed mb-10">
              Engineered for professional contractors who demand precision and durability in every strike, cut, and fastening.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-7 py-3.5 transition-colors">
                Shop Professional Tools
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white font-black uppercase text-[11px] tracking-[0.15em] px-7 py-3.5 transition-colors hover:bg-white/5">
                View Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────── */}
        <section className="bg-[#111111] border-b border-[#222]">
          <div className={inner}>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#222]">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center py-5 px-4 gap-1">
                  <div className="text-2xl font-black text-white tracking-tight">{value}</div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-[#777] font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────────── */}
        <section className="py-12 bg-[#0a0a0a]">
          <div className={inner}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Heavy Duty Categories</h2>
                <p className="text-[#666] text-sm mt-1 font-medium">Built for high-demand job sites and technical trades.</p>
              </div>
              <Link href="/products" className="text-sm text-accent hover:text-accent-hover font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                See All <ArrowRight size={14} />
              </Link>
            </div>

            {categories.length === 0 ? (
              <p className="text-[#666] text-sm">No categories available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {categories.slice(0, 4).map((cat, i) => {
                  const cfg = CATEGORY_CONFIGS[i] ?? CATEGORY_CONFIGS[0];
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="group relative overflow-hidden min-h-[260px] sm:min-h-[320px] flex flex-col justify-end"
                      style={{ background: cfg.bg }}
                    >
                      {/* spotlight highlight top-right */}
                      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 75% 20%,rgba(255,255,255,0.06) 0%,transparent 70%)" }} />
                      {/* bottom text-area blackout */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      {/* hover brightening */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-300" />

                      {cfg.badge && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">{cfg.badge}</span>
                        </div>
                      )}

                      <div className="relative p-6">
                        <div className="text-4xl mb-3">{cat.icon}</div>
                        <h3 className="font-black uppercase text-xl text-white tracking-tight leading-tight mb-2">{cat.name}</h3>
                        <p className="text-[#999] text-sm line-clamp-2 mb-5">{cat.description}</p>
                        <span className="inline-flex items-center gap-2 bg-accent group-hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 transition-colors">
                          {cfg.cta} <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {categories.length > 4 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                {categories.slice(4).map((cat) => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-1.5 bg-[#111] border border-[#222] hover:border-accent p-3 transition-colors group">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#aaa] group-hover:text-accent transition-colors text-center leading-tight">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── SHOP BY TRADE ─────────────────────────────────────────── */}
        <section className="py-10 bg-[#080808] border-t border-[#1a1a1a]">
          <div className={inner}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Shop by Trade</h2>
                <p className="text-[#666] text-sm mt-1 font-medium">Find exactly what your profession demands.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {TOP_TRADES.map((trade) => (
                <Link
                  key={trade.slug}
                  href={`/products?category=${trade.slug}`}
                  className="group flex flex-col items-center gap-3 bg-[#111] border border-[#1e1e1e] hover:border-accent hover:bg-[#141414] py-6 px-4 transition-all duration-200"
                >
                  <span className="text-3xl">{trade.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#888] group-hover:text-accent transition-colors text-center leading-tight">{trade.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOP TRADE DEALS ───────────────────────────────────────── */}
        <section className="py-10 bg-[#0d0d0d] border-t border-[#1a1a1a]">
          <div className={inner}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={18} className="text-accent" />
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Top Trade Deals</h2>
                </div>
                <p className="text-[#666] text-sm font-medium">Limited time discounts on essential trade equipment.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#111] border border-[#222] px-5 py-3 shrink-0">
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#666]">Ends In:</span>
                <CountdownTimer />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dealProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="mt-6 text-center">
              <Link href="/products?badge=Deal" className="inline-flex items-center gap-2 border border-[#333] hover:border-accent text-[#aaa] hover:text-accent font-bold uppercase text-[11px] tracking-[0.15em] px-6 py-3 transition-colors">
                View All Deals <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRO TOOL RENTAL CTA ───────────────────────────────────── */}
        <section className="bg-accent py-10">
          <div className={`${inner} flex flex-col sm:flex-row items-center justify-between gap-6`}>
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-center w-12 h-12 bg-black/20 shrink-0">
                <Wrench size={26} className="text-white" />
              </div>
              <div>
                <div className="font-black uppercase text-xl text-white tracking-tight">Pro Tool Rental</div>
                <p className="text-white/70 text-sm mt-0.5">Rent high-spec equipment for single-day projects at competitive trade rates.</p>
              </div>
            </div>
            <Link href="/contact" className="shrink-0 bg-white text-accent font-black uppercase text-[11px] tracking-[0.2em] px-8 py-3.5 hover:bg-gray-100 transition-colors">
              Portal Login
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
