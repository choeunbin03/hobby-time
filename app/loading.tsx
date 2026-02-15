import { ClassCardSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="h-48 w-full animate-pulse rounded-lg bg-muted md:h-64" /> {/* Hero Skeleton */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ClassCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
