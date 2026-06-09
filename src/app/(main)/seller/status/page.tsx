"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyApplication, type SellerApplication } from "@/lib/api/sellerApplication";
import { Clock, CheckCircle2, XCircle, Store, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SellerStatusPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [application, setApplication] = useState<SellerApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login?redirect=/seller/status"); return; }
    if (user.role === "seller") { router.replace("/seller"); return; }
    if (user.role === "admin")  { router.replace("/admin");  return; }

    getMyApplication()
      .then((res) => {
        if (!res.data) { router.replace("/become-seller"); return; }
        setApplication(res.data);
      })
      .catch(() => router.replace("/become-seller"))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <div className="w-full max-w-7xl mx-auto px-4 py-32 flex justify-center">
      <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );

  if (!application) return null;

  const statusConfig = {
    pending: {
      icon:    Clock,
      color:   "text-yellow-400",
      bg:      "bg-yellow-400/10",
      border:  "border-yellow-400/30",
      label:   "Under Review",
      message: "Your application has been received and is currently under review. Admin will respond within 1–2 business days.",
    },
    approved: {
      icon:    CheckCircle2,
      color:   "text-green-400",
      bg:      "bg-green-400/10",
      border:  "border-green-400/30",
      label:   "Approved",
      message: "Congratulations! Your seller application has been approved. You can now start listing your products.",
    },
    rejected: {
      icon:    XCircle,
      color:   "text-red-400",
      bg:      "bg-red-400/10",
      border:  "border-red-400/30",
      label:   "Rejected",
      message: "Unfortunately, your application was not approved at this time.",
    },
  }[application.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#555] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link href="/become-seller" className="hover:text-white transition-colors">Become a Seller</Link>
        <ChevronRight size={13} />
        <span className="text-white">Application Status</span>
      </nav>

      <div className="max-w-2xl mx-auto space-y-4">

        {/* Status banner */}
        <div className={`border p-6 ${statusConfig.bg} ${statusConfig.border}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${statusConfig.bg} border ${statusConfig.border}`}>
              <StatusIcon size={22} className={statusConfig.color} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-black text-white text-lg uppercase tracking-tight">
                  Application {statusConfig.label}
                </h1>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}>
                  {application.status}
                </span>
              </div>
              <p className="text-[#888] text-sm leading-relaxed">{statusConfig.message}</p>

              {application.status === "rejected" && application.rejectionReason && (
                <div className="mt-3 px-4 py-3 bg-red-500/5 border border-red-500/20">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1">Reason</p>
                  <p className="text-[#999] text-sm">{application.rejectionReason}</p>
                </div>
              )}

              {application.status === "approved" && (
                <div className="mt-4">
                  <Link
                    href="/seller"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-[0.15em] transition-colors"
                  >
                    <Store size={13} /> Go to Seller Dashboard
                  </Link>
                </div>
              )}

              {application.status === "rejected" && (
                <div className="mt-4">
                  <Link
                    href="/become-seller"
                    className="inline-flex items-center gap-2 h-10 px-5 border border-[#333] text-[#777] hover:text-white hover:border-[#555] text-[11px] font-black uppercase tracking-wider transition-colors"
                  >
                    <RefreshCw size={13} /> Re-apply
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application details */}
        <div className="bg-[#0f0f0f] border border-[#1e1e1e]">
          <div className="px-6 py-4 border-b border-[#1e1e1e]">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Application Details</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {[
              { label: "Business Name",    value: application.businessName    },
              { label: "Business Type",    value: application.businessType === "individual" ? "Individual / Freelancer" : "Registered Company" },
              { label: "PAN / VAT",        value: application.panNumber       },
              { label: "Phone",            value: application.phone           },
              { label: "Business Address", value: application.businessAddress },
              { label: "Description",      value: application.description     },
              { label: "Submitted",        value: new Date(application.createdAt).toLocaleString("en-NP", { dateStyle: "long", timeStyle: "short" }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="w-36 shrink-0 text-[10px] font-black uppercase tracking-wider text-[#555]">{label}</span>
                <span className="text-sm text-[#bbb] leading-relaxed">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {application.status === "pending" && (
          <p className="text-center text-xs text-[#444]">
            You&apos;ll receive a notification once a decision is made.
          </p>
        )}
      </div>
    </div>
  );
}
