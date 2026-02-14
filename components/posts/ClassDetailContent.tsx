"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Clock, MapPin, Sparkles, Store } from "lucide-react";
import type { ClassDetail } from "@/types/class";

interface ClassDetailContentProps {
  classItem: ClassDetail;
}

export function ClassDetailContent({ classItem }: ClassDetailContentProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {classItem.category}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                {classItem.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {classItem.duration_minutes}분
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {classItem.studios?.location_text}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">
                {classItem.price.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">원</span>
              <p className="mt-1 text-sm text-muted-foreground">1인 기준</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-foreground">클래스 소개</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {classItem.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-primary" />
            스튜디오 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-foreground">
              {classItem.studios?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {classItem.studios?.location_text}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {classItem.studios?.description || '스튜디오 소개가 없습니다.'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-accent" />
            AI 요약
            <Badge variant="outline" className="text-xs font-normal">
              임시 제공
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {classItem.category}에 관심 있다면 {classItem.studios?.location_text}의{" "}
            {classItem.studios?.name}에서 진행하는 {classItem.name} 클래스를 추천합니다.
            약 {classItem.duration_minutes}분 동안 핵심 기초부터 실습까지 진행하며, 1인
            기준 {classItem.price.toLocaleString()}원입니다.
          </p>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="container mx-auto flex items-center justify-between gap-4 md:justify-end">
          <div className="md:hidden">
            <span className="text-xl font-bold text-foreground">
              {classItem.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground">원</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(true)}
              className="flex-1 md:flex-none"
            >
              문의하기
            </Button>
            <Link href={`/classes/${classItem.id}/book`}>
              <Button className="flex-1 md:flex-none">예약하기</Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>문의하기</DialogTitle>
            <DialogDescription>
              문의 기능은 준비 중입니다. 곧 안내드릴게요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              닫기
            </Button>
            <Button>확인</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-20 md:hidden" />
    </div>
  );
}
