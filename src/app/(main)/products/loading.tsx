import { ProductCardSkeleton } from "@/components/products/ProductCard";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-40 skeleton rounded mb-2" />
        <div className="h-4 w-28 skeleton rounded" />
      </div>

      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-56 shrink-0 space-y-6">
          <div>
            <div className="h-4 w-16 skeleton rounded mb-3" />
            <div className="h-9 w-full skeleton rounded-md" />
          </div>
          <div>
            <div className="h-4 w-20 skeleton rounded mb-3" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 skeleton rounded" />
                <div className="h-3 skeleton rounded flex-1" />
              </div>
            ))}
          </div>
          <div>
            <div className="h-4 w-24 skeleton rounded mb-3" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 skeleton rounded-full" />
                <div className="h-3 skeleton rounded flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="flex-1">
          {/* Toolbar skeleton */}
          <div className="flex items-center justify-between mb-5">
            <div className="h-9 w-24 skeleton rounded-md lg:hidden" />
            <div className="h-9 w-32 skeleton rounded-md ml-auto" />
            <div className="h-9 w-20 skeleton rounded-md ml-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
