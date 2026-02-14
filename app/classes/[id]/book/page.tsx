import { notFound } from "next/navigation";
import Link from "next/link";
import { BookingContent } from "@/components/posts/BookingContent";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClassDetail, Session } from "@/types/class";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Validate UUID to prevent DB error
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  // Fetch Class Detail
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("*, studios(*)")
    .eq("id", id)
    .single();

  if (classError || !classData) {
    notFound();
  }

  // Fetch Available Sessions
  const { data: sessionsData, error: sessionError } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("class_id", id)
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true });

  const classItem = classData as unknown as ClassDetail;
  const timeSlots = (sessionsData || []) as unknown as Session[];

  return (
    <main className="container mx-auto px-4 py-6">
      <Link href={`/classes/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          클래스 상세로 돌아가기
        </Button>
      </Link>
      <BookingContent classItem={classItem} sessions={timeSlots} />
    </main>
  );
}
