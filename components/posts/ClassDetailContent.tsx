import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Store } from "lucide-react";
import type { ClassListItem } from "@/types/class";

interface ClassDetailContentProps {
  classItem: ClassListItem;
}

/** 클래스 상세 화면: 정보, 스튜디오, CTA */
export function ClassDetailContent({ classItem }: ClassDetailContentProps) {
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
                  {classItem.duration}분
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {classItem.studio.location}
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
              {classItem.studio.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {classItem.studio.location}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {classItem.studio.description}
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xl font-bold text-foreground sm:text-2xl">
          {classItem.price.toLocaleString()}원
          <span className="ml-1 text-sm text-muted-foreground">1인</span>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">목록으로</Button>
          </Link>
          <Link href={`/classes/${classItem.id}/book`}>
            <Button>예약하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
