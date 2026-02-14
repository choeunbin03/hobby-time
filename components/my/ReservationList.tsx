"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ReservationWithDetails } from "@/types/class";

interface ReservationListProps {
  reservations: ReservationWithDetails[];
}

export function ReservationList({ reservations }: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-foreground">
          예약된 클래스가 없습니다
        </h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          새로운 취미를 찾아보세요! 다양한 클래스가 기다리고 있습니다.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/">클래스 둘러보기</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-success text-success-foreground">확정됨</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">취소됨</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">이용완료</Badge>;
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

        if (!session || !classItem) return null;

        return (
          <Card key={reservation.id} className="overflow-hidden transition-all hover:border-primary/50">
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
                    {/* Future Feature: Cancel Button */}
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
