import { notFound } from "next/navigation";
import { ClassDetailContent } from "@/components/posts/ClassDetailContent";
import { mockClasses } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: PageProps) {
  const { id } = await params;
  const classItem = mockClasses.find((c) => c.id === id);
  if (!classItem) return notFound();

  return (
    <main className="container mx-auto px-4 py-6">
      <ClassDetailContent classItem={classItem} />
    </main>
  );
}
