"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, selectCartCount } from "@/store/slices/cartSlice";
import { toggleMobileMenu, closeMobileMenu } from "@/store/slices/uiSlice";
import type { RootState } from "@/store/index";
import { ShoppingCart, Search, Menu, X, Cpu, User, Store, Heart, Bell, LayoutDashboard } from "lucide-react";
import { fetchWishlist, selectWishlistCount } from "@/store/slices/wishlistSlice";
import { fetchUnreadCount, selectUnreadCount } from "@/store/slices/notificationSlice";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { twMerge } from "tailwind-merge";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Products", href: "/products" },
  { label: "Deals",    href: "/products?badge=Deal" },
  { label: "Orders",   href: "/orders" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const mobileOpen = useSelector((s: RootState) => s.ui.mobileMenuOpen);

  const { user, logout, loading: authLoading } = useAuth();
  const wishlistCount  = useSelector(selectWishlistCount);
  const unreadCount    = useSelector(selectUnreadCount);

  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { dispatch(closeMobileMenu()); }, [pathname, dispatch]);

  // Seed Redux with server data on login / page refresh
  const isLoggedIn = !authLoading && !!user;
  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchCart() as any);
    dispatch(fetchWishlist() as any);
    dispatch(fetchUnreadCount() as any);
  }, [isLoggedIn, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={twMerge(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/40"
          : "bg-[#0a0a0a] border-b border-border/50"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="HardwareHub Home">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent group-hover:bg-accent-hover transition-colors">
              <Cpu size={18} className="text-white" />
            </span>
            <span className="font-bold text-lg tracking-tight">
              Hardware<span className="text-accent">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={twMerge(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-accent bg-accent-muted"
                    : "text-muted hover:text-white hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search — grows to fill space */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md ml-auto hidden sm:block" role="search">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CPUs, GPUs, RAM…"
                aria-label="Search products"
                className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-2">
            {/* Admin Panel */}
            {user?.role === "admin" && (
              <Link href="/admin" className="relative flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-accent hover:bg-surface transition-colors" aria-label="Admin Panel" title="Admin Panel">
                <LayoutDashboard size={20} />
              </Link>
            )}

            {/* Seller Dashboard */}
            {user?.role === "seller" && (
              <Link href="/seller" className="relative flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-accent hover:bg-surface transition-colors" aria-label="Seller Dashboard" title="Seller Dashboard">
                <Store size={20} />
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <Link href="/notifications" className="relative flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-white hover:bg-surface transition-colors" aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full px-1 leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Wishlist */}
            {user && (
              <Link href="/wishlist" className="relative flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-white hover:bg-surface transition-colors" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full px-1 leading-none">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-white hover:bg-surface transition-colors" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full px-1 leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {!authLoading && (
              user ? (
                <button
                  onClick={logout}
                  className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium text-muted hover:text-white hover:border-border-hover transition-colors"
                >
                  <User size={15} />
                  {user.username ?? user.name ?? "Account"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium text-muted hover:text-white hover:border-border-hover transition-colors"
                >
                  <User size={15} />
                  Sign In
                </Link>
              )
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} role="search">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-[#0a0a0a]"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={twMerge(
                  "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-accent bg-accent-muted"
                    : "text-muted hover:text-white hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-3">
              {!authLoading && (
                user ? (
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-3 rounded-md text-sm font-medium text-muted hover:text-white hover:bg-surface transition-colors text-left"
                  >
                    <User size={16} />
                    {user.username ?? user.name ?? "Account"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium text-muted hover:text-white hover:bg-surface transition-colors"
                  >
                    <User size={16} />
                    Sign In
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

