
import Link from 'next/link';
import { ClassWithStudio } from '@/types/class';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';

interface ClassCardProps {
  classItem: ClassWithStudio;
}

export function ClassCard({ classItem }: ClassCardProps) {
  return (
    <Link href={`/classes/${classItem.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer group">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            {/* Placeholder for image - in real app would use <Image> with src from storage */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                이미지 준비중
            </div>
            <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white/90 text-black hover:bg-white">{classItem.category}</Badge>
            </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {classItem.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{classItem.studios?.location_text || '지역 정보 없음'}</span>
                <span className="mx-1">·</span>
                <span className="font-medium text-foreground">{classItem.studios?.name}</span>
            </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 pb-3">
            <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {classItem.description}
            </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-transparent mt-auto">
            <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {classItem.duration_minutes}분
            </div>
            <div className="font-bold text-lg">
                {new Intl.NumberFormat('ko-KR').format(classItem.price)}원
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
