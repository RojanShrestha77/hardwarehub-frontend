import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        primary:   "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]",
        secondary: "bg-surface text-white border border-border hover:bg-surface-hover hover:border-border-hover active:scale-[0.98]",
        ghost:     "text-muted hover:text-white hover:bg-surface active:scale-[0.98]",
        danger:    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        outline:   "border border-accent text-accent hover:bg-accent-muted active:scale-[0.98]",
      },
      size: {
        sm:   "h-8  px-3 text-sm",
        md:   "h-10 px-4 text-sm",
        lg:   "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
