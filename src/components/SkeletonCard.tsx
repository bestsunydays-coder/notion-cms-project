/**
 * 스켈레톤 카드 컴포넌트
 * 포스트 카드 로딩 중 플레이스홀더를 표시합니다.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
  return (
    <Card className="h-full overflow-hidden shadow-md">
      {/* 썸네일 스켈레톤 */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <CardHeader className="pb-3">
        {/* 카테고리 뱃지 스켈레톤 */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="w-20 h-6 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>

        {/* 제목 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton className="w-full h-5 rounded" />
          <Skeleton className="w-3/4 h-5 rounded" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 요약 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-2/3 h-4 rounded" />
        </div>

        {/* 태그 스켈레톤 */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="w-12 h-6 rounded" />
          <Skeleton className="w-16 h-6 rounded" />
          <Skeleton className="w-14 h-6 rounded" />
        </div>

        {/* 메타데이터 스켈레톤 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-24 h-4 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
