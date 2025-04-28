import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-12" />

          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Featured listings skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16">
          <Skeleton className="h-8 w-64 mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        </div>

        {/* Sections by type skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-16">
            <Skeleton className="h-8 w-64 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-[200px] rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
