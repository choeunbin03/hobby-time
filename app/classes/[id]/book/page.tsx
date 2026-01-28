import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookingContent } from "@/components/posts/BookingContent";
import { mockClasses, mockTimeSlots } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getClassAndSlots(id: string) {
  const classItem = mockClasses.find((c) => c.id === id) || null;
  const timeSlots = mockTimeSlots.filter((ts) => ts.classId === id);
  return { classItem, timeSlots };
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;
  const { classItem, timeSlots } = getClassAndSlots(id);
  if (!classItem) return notFound();

  return (
    <main className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">예약하기</p>
          <h1 className="text-xl font-semibold text-foreground">{classItem.name}</h1>
          <p className="text-sm text-muted-foreground">
            {classItem.studio.name} · {classItem.studio.location}
          </p>
        </div>
        <Link href={`/classes/${id}`}>
          <Button variant="ghost" size="sm">
            클래스 정보로 돌아가기
          </Button>
        </Link>
      </div>

      <BookingContent classItem={classItem} timeSlots={timeSlots} />
    </main>
  );
}
