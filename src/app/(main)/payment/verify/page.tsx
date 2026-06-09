"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyKhaltiPayment } from "@/lib/api/payment";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const khaltiStatus = searchParams.get("status");

    if (!pidx || khaltiStatus !== "Completed") {
      setStatus("failed");
      return;
    }

    verifyKhaltiPayment(pidx)
      .then((res) => {
        if (res.success) {
          setOrderId(res.data.orderId);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [searchParams]);

  if (status === "loading")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-accent" />
        <p className="text-[#555] text-sm font-bold uppercase tracking-widest">
          Verifying payment…
        </p>
      </div>
    );

  if (status === "success")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle size={64} className="text-green-500 mb-6" />
        <h1 className="text-2xl font-black uppercase text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-[#555] text-sm mb-8">
          Your order has been placed and payment confirmed via Khalti.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors"
            >
              Track Order
            </Link>
          )}
          <Link
            href="/products"
            className="border border-[#333] hover:border-[#555] text-[#aaa] hover:text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <XCircle size={64} className="text-red-500 mb-6" />
      <h1 className="text-2xl font-black uppercase text-white mb-2">
        Payment Failed
      </h1>
      <p className="text-[#555] text-sm mb-8">
        Your payment could not be completed. No charges were made.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="bg-accent hover:bg-accent-hover text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="border border-[#333] hover:border-[#555] text-[#aaa] hover:text-white font-black uppercase text-[11px] tracking-[0.15em] px-8 py-3.5 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-accent" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
