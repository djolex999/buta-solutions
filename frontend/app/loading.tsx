import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-20 bg-border rounded" />
          <div className="hidden md:flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 bg-border rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center animate-pulse space-y-6">
          <div className="h-16 bg-border rounded w-3/4 mx-auto" />
          <div className="h-6 bg-border rounded w-2/3 mx-auto" />
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-12 w-36 bg-border rounded-lg" />
            <div className="h-12 w-36 bg-border rounded-lg" />
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <LoadingSkeleton variant="section" />
      </div>

      {/* Projects skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-border rounded w-1/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
