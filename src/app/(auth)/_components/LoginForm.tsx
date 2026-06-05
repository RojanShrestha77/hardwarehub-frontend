"use client";

import { loginSchema, LoginFormData } from "@/app/(auth)/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleLogin } from "@/lib/actions/auth.action";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const result = await handleLogin(data);
      if (!result.success) throw new Error(result.message);
      await checkAuth();
      startTransition(() => router.push("/"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const inputBase =
    "w-full h-11 px-3 bg-[#0a0a0a] border rounded-md text-sm text-white placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your HardwareHub account</p>
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
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputBase} ${errors.email ? "border-red-500 focus:ring-red-500" : "border-border focus:border-transparent"}`}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`${inputBase} pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-border focus:border-transparent"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 flex items-center justify-center gap-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in…
              </>
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
