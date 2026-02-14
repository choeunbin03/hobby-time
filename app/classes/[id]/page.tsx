import { notFound } from "next/navigation";
import Link from "next/link";
import { ClassDetailContent } from "@/components/posts/ClassDetailContent";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { ClassDetail } from "@/types/class";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Validate UUID format to prevent database errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("classes")
    .select("*, studios(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        console.error("Error fetching class detail:", error);
    }
    notFound();
  }

  const classItem = data as unknown as ClassDetail;

  return (
    <main className="container mx-auto px-4 py-6">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </Link>
      <ClassDetailContent classItem={classItem} />
    </main>
  );
}
