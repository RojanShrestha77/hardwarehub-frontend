"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applyAsSeller, getMyApplication } from "@/lib/api/sellerApplication";
import {
  Store, Building2, User, FileText, Phone,
  MapPin, BadgeCheck, Loader2, ChevronRight,
} from "lucide-react";
import Link from "next/link";

type BusinessType = "individual" | "company";

export default function BecomeSellerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [checking, setChecking]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    businessName:    "",
    businessType:    "individual" as BusinessType,
    panNumber:       "",
    phone:           "",
    businessAddress: "",
    description:     "",
  });

  // Check if user already applied
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login?redirect=/become-seller"); return; }
    if (user.role === "seller") { router.replace("/seller"); return; }
    if (user.role === "admin")  { router.replace("/admin");  return; }

    getMyApplication()
      .then((res) => {
        if (res.data) router.replace("/seller/status");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [user, authLoading, router]);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await applyAsSeller(form);
      router.push("/seller/status");
    } catch (e: any) {
      setError(e.response?.data?.message ?? e.message ?? "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || checking) return (
    <div className="w-full max-w-7xl mx-auto px-4 py-32 flex justify-center">
      <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );

  const inputCls = "w-full h-10 px-3 bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#555] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={13} />
        <span className="text-white">Become a Seller</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left — Benefits panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6">
            <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-4">
              <Store size={22} className="text-accent" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white mb-2">
              Start Selling on HardwareHub
            </h2>
            <p className="text-[#555] text-sm leading-relaxed">
              Join thousands of sellers reaching hardware enthusiasts across Nepal.
            </p>
          </div>

          {[
            { icon: BadgeCheck, title: "Verified Badge",    desc: "Get a verified seller badge after approval" },
            { icon: Store,      title: "Your Dashboard",    desc: "Full CRUD control over your product listings" },
            { icon: FileText,   title: "Order Management",  desc: "Manage incoming orders in one place"          },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#0f0f0f] border border-[#1e1e1e] p-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-accent/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <div>
                <p className="font-black text-white text-sm">{title}</p>
                <p className="text-[#555] text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Application form */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e]">
            <div className="px-6 py-4 border-b border-[#1e1e1e]">
              <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                Seller Application
              </h1>
              <p className="text-[#555] text-xs mt-1">
                Fill in your business details. Admin will review within 1–2 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Business Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-2">
                  Business Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "individual", label: "Individual / Freelancer", icon: User      },
                    { value: "company",    label: "Registered Company",      icon: Building2 },
                  ] as { value: BusinessType; label: string; icon: any }[]).map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                        form.businessType === value
                          ? "border-accent bg-accent/5"
                          : "border-[#222] hover:border-[#333]"
                      }`}
                    >
                      <input
                        type="radio" name="businessType" value={value}
                        checked={form.businessType === value}
                        onChange={() => setField("businessType", value)}
                        className="accent-accent"
                      />
                      <Icon size={15} className={form.businessType === value ? "text-accent" : "text-[#555]"} />
                      <span className={`text-sm font-bold ${form.businessType === value ? "text-white" : "text-[#777]"}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Business Name + PAN */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                    Business Name *
                  </label>
                  <input
                    required type="text" value={form.businessName}
                    onChange={(e) => setField("businessName", e.target.value)}
                    className={inputCls} placeholder="e.g., Tech Nepal Pvt. Ltd."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                    PAN / VAT Number *
                  </label>
                  <input
                    required type="text" value={form.panNumber}
                    onChange={(e) => setField("panNumber", e.target.value)}
                    className={inputCls} placeholder="e.g., 123456789"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                  Business Phone *
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none" />
                  <input
                    required type="tel" value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={`${inputCls} pl-9`} placeholder="98XXXXXXXX"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                  Business Address *
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-[#444] pointer-events-none" />
                  <textarea
                    required value={form.businessAddress}
                    onChange={(e) => setField("businessAddress", e.target.value)}
                    rows={2}
                    className={`${inputCls} h-auto resize-none py-2.5 pl-9`}
                    placeholder="Street, City, District, Province"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                  What will you sell? *
                </label>
                <textarea
                  required value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className={`${inputCls} h-auto resize-none py-2.5`}
                  placeholder="Describe your products, brand, and business (min 10 characters)…"
                />
              </div>

              <div className="pt-1 flex gap-3">
                <Link
                  href="/"
                  className="flex-1 h-11 flex items-center justify-center border border-[#333] text-[#777] hover:text-white hover:border-[#555] text-[11px] font-black uppercase tracking-wider transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-[0.15em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
