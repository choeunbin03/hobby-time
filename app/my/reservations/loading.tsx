import { ReservationListSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">내 예약 목록</h1>
      <ReservationListSkeleton />
    </main>
  );
}
