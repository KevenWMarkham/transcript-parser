import { TranscriptEntrySkeleton } from './TranscriptEntrySkeleton'

interface TranscriptListSkeletonProps {
  count?: number
}

export function TranscriptListSkeleton({
  count = 5,
}: TranscriptListSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading transcript">
      {Array.from({ length: count }).map((_, index) => (
        <TranscriptEntrySkeleton key={index} />
      ))}
    </div>
  )
}
