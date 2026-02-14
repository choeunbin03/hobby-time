"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Minus, Plus, Users, CheckCircle2, AlertCircle } from "lucide-react";
import type { ClassDetail, Session } from "@/types/class";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { reserveClass } from "@/app/actions/booking";

interface BookingContentProps {
  classItem: ClassDetail;
  sessions: Session[];
}

export function BookingContent({ classItem, sessions }: BookingContentProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [guests, setGuests] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group sessions by Date (YYYY-MM-DD)
  const sessionsByDate = useMemo(() => {
    return sessions.reduce((acc, session) => {
      const dateKey = format(new Date(session.start_at), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }, [sessions]);

  const availableSeats = selectedSession
    ? selectedSession.capacity - selectedSession.booked_count
    : 0;

  const handleGuestChange = (delta: number) => {
    const next = guests + delta;
    if (next >= 1 && next <= availableSeats) setGuests(next);
  };

  const handleBook = async () => {
    if (!selectedSession) return;
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("classId", classItem.id);
    formData.append("sessionId", selectedSession.id);
    formData.append("headCount", guests.toString());

    startTransition(async () => {
        const result = await reserveClass(null, formData);
        
        // If result contains message (error or success handled by redirect), show it
        // Note: Success redirect happens in server action, so if we are here, it might be error or just fall through
        if (result?.message) {
            setErrorMsg(result.message);
            setShowConfirmDialog(false); // Close dialog to show error
        }
    });
  };

  const totalPrice = classItem.price * guests;

  return (
    <div className="space-y-6">
      {/* Class Info Summary */}
      <Card>
        <CardContent className="p-4">
          <h1 className="text-lg font-bold text-foreground">{classItem.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {classItem.studios?.name} · {classItem.studios?.location_text}
          </p>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errorMsg && (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{errorMsg}</span>
          </div>
      )}

      {/* Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            일정 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(sessionsByDate).map(([dateKey, dailySessions]) => (
            <div key={dateKey}>
              <h3 className="mb-3 font-medium text-foreground">
                {format(new Date(dateKey), "PPP (EEE)", { locale: ko })}
              </h3>
              <div className="space-y-2">
                {dailySessions.map((session) => {
                  const startDate = new Date(session.start_at);
                  const remaining = session.capacity - session.booked_count;
                  const isSoldOut = remaining <= 0;
                  const isSelected = selectedSession?.id === session.id;
                  
                  return (
                    <button
                      type="button"
                      key={session.id}
                      onClick={() => {
                        if (!isSoldOut) {
                          setSelectedSession(session);
                          setGuests(1);
                        }
                      }}
                      disabled={isSoldOut}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border p-4 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/50",
                        isSoldOut && "cursor-not-allowed opacity-50 bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {format(startDate, "p", { locale: ko })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {isSoldOut ? (
                          <Badge variant="secondary">마감</Badge>
                        ) : (
                          <span
                            className={cn(
                              "text-sm",
                              remaining <= 2
                                ? "font-medium text-destructive"
                                : "text-muted-foreground"
                            )}
                          >
                            잔여 {remaining}석
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="py-8 text-center bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                현재 예약 가능한 일정이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Count Selection */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              인원 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">예약 인원</p>
                <p className="text-sm text-muted-foreground">
                  최대 {availableSeats}명까지 선택 가능
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGuestChange(-1)}
                  disabled={guests <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-lg font-bold text-foreground">
                  {guests}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGuestChange(1)}
                  disabled={guests >= availableSeats}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Price & Submit */}
      {selectedSession && (
        <Card className="sticky bottom-4 border-primary/20 shadow-lg md:static">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {classItem.price.toLocaleString()}원 x {guests}명
                </p>
                <p className="text-xl font-bold text-foreground">
                  총 {totalPrice.toLocaleString()}원
                </p>
              </div>
              <Button size="lg" onClick={() => setShowConfirmDialog(true)} className="px-8 font-semibold">
                예약하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약을 확정할까요?</DialogTitle>
            <DialogDescription>
                결제는 현장에서 진행됩니다. 아래 내용을 확인해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">클래스</span>
              <span className="font-medium text-foreground text-right break-keep pl-4">{classItem.name}</span>
            </div>
            {selectedSession && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">일정</span>
                  <span className="text-foreground text-right">
                    {format(new Date(selectedSession.start_at), "PPP (EEE) p", { locale: ko })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">인원</span>
                  <span className="text-foreground">{guests}명</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 mt-2">
                  <span className="font-medium text-foreground">총 금액 (현장결제)</span>
                  <span className="font-bold text-foreground text-lg">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isPending}>
              취소
            </Button>
            <Button onClick={handleBook} disabled={isPending}>
                {isPending ? "처리중..." : "예약 확정"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
