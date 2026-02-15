import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReservationList } from "@/components/my/ReservationList";
import { ReservationWithDetails } from "@/types/class";

export const dynamic = "force-dynamic";

export default async function MyReservationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/my/reservations");
  }

  // Fetch reservations with joined data
  // The query structure matches ReservationWithDetails type
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      class_sessions (
        *,
        classes (
          *,
          studios (*)
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reservations:", error);
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">내 예약 목록</h1>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          예약 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </div>
      </main>
    );
  }

  const reservations = (data || []) as unknown as ReservationWithDetails[];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">내 예약 목록</h1>
      <ReservationList reservations={reservations} />
    </main>
  );
}
