
import { ClassWithStudio } from '@/types/class';
import { ClassCard } from './ClassCard';

interface ClassGridProps {
  classes: ClassWithStudio[];
}

export function ClassGrid({ classes }: ClassGridProps) {
  if (classes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">조건에 맞는 클래스가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls.id} classItem={cls} />
      ))}
    </div>
  );
}
