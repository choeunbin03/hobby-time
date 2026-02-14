
"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: '요리', label: '요리/베이킹' },
  { id: '공예', label: '공예/만들기' },
  { id: '미술', label: '미술/드로잉' },
  { id: '음악', label: '음악' },
  { id: '운동', label: '운동/댄스' },
  { id: '기타', label: '기타' },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = useCallback((categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    router.push(`/?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={
            (category.id === 'all' && !searchParams.get('category')) || currentCategory === category.id 
              ? "default" 
              : "outline"
          }
          className={cn(
            "rounded-full px-6",
            ((category.id === 'all' && !searchParams.get('category')) || currentCategory === category.id) 
              ? "font-semibold" 
              : "text-muted-foreground"
          )}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
