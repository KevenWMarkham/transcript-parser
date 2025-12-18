import { Skeleton } from '@/components/ui/skeleton'

export function TranscriptEntrySkeleton() {
  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-4">
      <div className="flex items-center gap-3 mb-3">
        {/* Speaker badge skeleton */}
        <Skeleton className="h-6 w-24" />

        {/* Timestamp skeleton */}
        <Skeleton className="h-4 w-32" />

        {/* Confidence skeleton */}
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Text skeleton - 2-3 lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

export function TranscriptListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TranscriptEntrySkeleton key={i} />
      ))}
    </div>
  )
}
