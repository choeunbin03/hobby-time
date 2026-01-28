import { notFound } from "next/navigation";
import Link from "next/link";
import { BookingContent } from "@/components/posts/BookingContent";
import { mockClasses, mockTimeSlots } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const classItem = mockClasses.find((item) => item.id === id);
  const timeSlots = mockTimeSlots.filter((slot) => slot.classId === id);

  if (!classItem) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <Link href={`/classes/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          클래스 상세로 돌아가기
        </Button>
      </Link>
      <BookingContent classItem={classItem} timeSlots={timeSlots} />
    </main>
  );
}
