import { notFound } from "next/navigation";
import Link from "next/link";
import { ClassDetailContent } from "@/components/posts/ClassDetailContent";
import { mockClasses } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const classItem = mockClasses.find((item) => item.id === id);

  if (!classItem) {
    notFound();
  }

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
