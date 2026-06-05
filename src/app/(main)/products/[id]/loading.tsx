export default function ProductDetailLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-14 skeleton rounded" />
            {i < 3 && <div className="h-3 w-2 skeleton rounded" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">

        {/* Image skeleton */}
        <div className="space-y-3">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-20 h-20 skeleton rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-32 skeleton rounded" />
          <div className="h-8 w-3/4 skeleton rounded" />
          <div className="h-8 w-full skeleton rounded" />
          <div className="h-5 w-36 skeleton rounded" />

          {/* Price skeleton */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-40 skeleton rounded" />
            <div className="h-6 w-28 skeleton rounded" />
            <div className="h-6 w-20 skeleton rounded" />
          </div>

          {/* Stock skeleton */}
          <div className="h-4 w-44 skeleton rounded" />

          {/* Description skeleton */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-2/3 skeleton rounded" />
          </div>

          {/* Actions skeleton */}
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-32 skeleton rounded-md" />
            <div className="h-10 flex-1 skeleton rounded-md" />
          </div>
          <div className="h-12 w-full skeleton rounded-md" />

          {/* Guarantees skeleton */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-9 w-9 skeleton rounded-lg" />
                <div className="h-3 w-16 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-6 gap-4">
          <div className="h-10 w-32 skeleton rounded" />
          <div className="h-10 w-28 skeleton rounded" />
        </div>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-3 px-5 py-3.5 gap-4 ${i % 2 === 0 ? "bg-surface" : "bg-surface-hover"}`}>
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-4 w-32 skeleton rounded col-span-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Related products skeleton */}
      <div>
        <div className="h-6 w-36 skeleton rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 skeleton rounded" />
                <div className="h-4 w-full skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
                <div className="flex justify-between pt-1">
                  <div className="h-6 w-24 skeleton rounded" />
                  <div className="h-8 w-14 skeleton rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
