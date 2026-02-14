
"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REGIONS = [
  { id: 'all', label: '전체 지역' },
  { id: 'SEOUL', label: '서울' },
  { id: 'GYEONGGI', label: '경기' },
  { id: 'INCHEON', label: '인천' },
  { id: 'BUSAN', label: '부산' },
  { id: 'JEJU', label: '제주' },
];

export function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRegion = searchParams.get('region') || 'all';

  const handleRegionChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete('region');
    } else {
      params.set('region', value);
    }
    
    router.push(`/?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex justify-center">
      <Select value={currentRegion} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="지역 선택" />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
