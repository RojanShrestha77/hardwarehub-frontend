import Link from "next/link";
import { Cpu } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent group-hover:bg-accent-hover transition-colors">
          <Cpu size={18} className="text-white" />
        </span>
        <span className="font-bold text-xl">
          Hardware<span className="text-accent">Hub</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
