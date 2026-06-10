"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/lib/api/auth";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, CheckCircle2, Loader2, XCircle, Cpu } from "lucide-react";

const schema = z
  .object({
    newPassword:     z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token");

  const [done,  setDone]  = useState(false);
  const [error, setError] = useState("");
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  // Redirect to forgot-password if no token in URL
  useEffect(() => {
    if (!token) router.replace("/forgot-password");
  }, [token, router]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setError("");
    try {
      await resetPassword(token, data.newPassword);
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (e: any) {
      setError(e.message ?? "Reset failed");
    }
  };

  const inputBase =
    "w-full h-11 px-3 bg-[#0a0a0a] border rounded-md text-sm text-white placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent";

  if (!token) return null;

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

        {done ? (
          /* ── Success state ── */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Password updated!</h2>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Your password has been reset successfully.
              Redirecting you to sign in…
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 h-11 w-full bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition-all text-sm"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="mb-7">
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center mb-4">
                <KeyRound size={18} className="text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-white">Set new password</h1>
              <p className="text-muted text-sm mt-1">
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-start gap-2">
                <XCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* New password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    {...register("newPassword")}
                    aria-invalid={!!errors.newPassword}
                    className={`${inputBase} pr-10 ${errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-border focus:border-transparent"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    className={`${inputBase} pr-10 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-border focus:border-transparent"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 flex items-center justify-center gap-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Updating…</>
                ) : (
                  "Reset Password"
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
