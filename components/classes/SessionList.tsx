"use client";

import { useSessions } from "@/hooks/useSessions";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SessionListProps {
  classId: string;
}

export function SessionList({ classId }: SessionListProps) {
  const { sessions, isLoading, error } = useSessions(classId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">일정 확인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md">불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
                일정을 불러오는데 실패했습니다.
            </div>
          </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    예약 가능 일정
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground p-4">
                    현재 예약 가능한 일정이 없습니다.
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          예약 가능 일정
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {sessions.map((session) => {
          const startDate = new Date(session.start_at);
          const isFull = session.booked_count >= session.capacity;
          const availableCount = session.capacity - session.booked_count;
          
          return (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium">
                  {format(startDate, "PPP (EEE)", { locale: ko })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(startDate, "p", { locale: ko })} 시작
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {isFull ? (
                        <span className="text-destructive font-medium">매진</span>
                    ) : (
                        <>
                            <span className="text-primary font-medium">{availableCount}</span>
                            /{session.capacity}명
                        </>
                    )}
                  </span>
                </div>
                
                <Button 
                    variant={isFull ? "outline" : "default"} 
                    size="sm"
                    disabled={isFull}
                >
                    {isFull ? "마감" : "예약"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
