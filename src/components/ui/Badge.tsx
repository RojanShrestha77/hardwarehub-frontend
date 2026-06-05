import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        accent:  "bg-accent-muted text-accent border border-accent/20",
        success: "bg-green-500/10 text-green-400 border border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        danger:  "bg-red-500/10 text-red-400 border border-red-500/20",
        muted:   "bg-surface text-muted border border-border",
      },
    },
    defaultVariants: { variant: "muted" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={twMerge(badgeVariants({ variant }), className)} {...props} />;
}
