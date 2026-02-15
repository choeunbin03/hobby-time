"use client";

import { toast } from "sonner";
import { cancelReservation } from "@/app/actions/booking";
import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ReservationWithDetails } from "@/types/class";

interface ReservationListProps {
  reservations: ReservationWithDetails[];
}

export function ReservationList({ reservations }: ReservationListProps) {
  const [isPending, startTransition] = useTransition();

  if (reservations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">예약 내역이 없습니다.</p>
        <Button asChild className="mt-4">
          <Link href="/classes">클래스 둘러보기</Link>
        </Button>
      </Card>
    );
  }

  const handleCancel = async (reservationId: string) => {
    const confirmed = window.confirm("정말로 예약을 취소하시겠습니까?");
    if (!confirmed) return;

    startTransition(async () => {
        const result = await cancelReservation(reservationId);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="default">예약 확정</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">취소됨</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">이용 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => {
        const session = reservation.class_sessions;
        const classItem = session?.classes;
        const studio = classItem?.studios;
        const isCancelled = reservation.status === "CANCELLED";
        const isCancellable = reservation.status === "CONFIRMED";

        if (!session || !classItem) return null;

        return (
          <Card 
            key={reservation.id} 
            className={`overflow-hidden transition-all hover:border-primary/50 ${
                isCancelled ? "opacity-60 bg-muted/50 grayscale" : ""
            }`}
          >
            {/* ... (Header) */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-3 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  예약번호 {reservation.id.slice(0, 8)}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {format(new Date(reservation.created_at), "yyyy.MM.dd")} 예약
                </span>
              </div>
              {getStatusBadge(reservation.status)}
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground sm:text-xl">
                    {classItem.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{studio?.name} ({studio?.location_text})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-foreground">
                            {format(new Date(session.start_at), "PPP (EEE) p", { locale: ko })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{reservation.head_count}명</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t pt-4 sm:items-end sm:border-t-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">결제 예정 금액</p>
                    <p className="text-lg font-bold text-primary">
                      {(classItem.price * reservation.head_count).toLocaleString()}원
                    </p>
                    <p className="text-xs text-muted-foreground">(현장 결제)</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/classes/${classItem.id}`}>
                            클래스 상세
                        </Link>
                    </Button>
                    {isCancellable && (
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            disabled={isPending}
                            onClick={() => handleCancel(reservation.id)}
                        >
                            {isPending ? "취소 중..." : "예약 취소"}
                        </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
