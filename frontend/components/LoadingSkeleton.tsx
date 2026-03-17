interface SkeletonProps {
  variant?: "card" | "text" | "section";
  className?: string;
}

export default function LoadingSkeleton({
  variant = "text",
  className = "",
}: SkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={`bg-surface border border-border rounded-xl overflow-hidden animate-pulse ${className}`}
      >
        <div className="aspect-video bg-border" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-full" />
          <div className="h-3 bg-border rounded w-2/3" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-16 bg-border rounded" />
            <div className="h-6 w-16 bg-border rounded" />
            <div className="h-6 w-16 bg-border rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={`animate-pulse space-y-8 ${className}`}>
        <div className="h-10 bg-border rounded w-1/3 mx-auto" />
        <div className="h-4 bg-border rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6 space-y-4"
            >
              <div className="h-8 w-8 bg-border rounded" />
              <div className="h-5 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // text variant
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      <div className="h-4 bg-border rounded w-full" />
      <div className="h-4 bg-border rounded w-5/6" />
      <div className="h-4 bg-border rounded w-4/6" />
    </div>
  );
}
