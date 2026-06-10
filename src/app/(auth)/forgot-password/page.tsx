"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/lib/api/auth";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Cpu } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    }
  };

  const inputBase =
    "w-full h-11 px-3 bg-[#0a0a0a] border rounded-md text-sm text-white placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl shadow-black/50">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-7">
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent">
            <Cpu size={16} className="text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-white">
            Hardware<span className="text-accent">Hub</span>
          </span>
        </div>

        {sent ? (
          /* ── Success state ── */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-muted text-sm leading-relaxed mb-1">
              We sent a password reset link to
            </p>
            <p className="text-white text-sm font-semibold mb-6">{getValues("email")}</p>
            <p className="text-muted text-xs mb-6">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                className="text-accent hover:text-accent-hover transition-colors"
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
              <p className="text-muted text-sm mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    className={`${inputBase} pl-9 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-border focus:border-transparent"}`}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 flex items-center justify-center gap-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending…</>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className="text-sm text-center text-muted mt-6">
              Remembered it?{" "}
              <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
