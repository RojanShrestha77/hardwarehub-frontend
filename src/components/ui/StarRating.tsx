import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, count, size = 14, className }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const partial = !filled && star <= rating + 0.5;
          return (
            <span key={star} className="relative inline-flex">
              <Star
                size={size}
                className="text-[#333]"
                fill="currentColor"
              />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : "50%" }}
                >
                  <Star size={size} className="text-accent" fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
