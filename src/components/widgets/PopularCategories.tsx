/**
 * 인기 카테고리 위젯
 * 상위 5개의 인기 카테고리를 표시하는 위젯입니다.
 */

import Link from 'next/link';
import { getCategories } from '@/lib/notion';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 인기 카테고리 위젯 로딩 스켈레톤
 */
export function PopularCategoriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
    </div>
  );
}

/**
 * 인기 카테고리 위젯
 */
export default async function PopularCategories() {
  try {
    // 카테고리 조회
    const categories = await getCategories();

    // 포스트 개수 기준으로 상위 5개만 선택
    const topCategories = categories
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        {/* 헤더 */}
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          인기 카테고리
        </h3>

        {/* 카테고리 목록 */}
        {topCategories.length > 0 ? (
          <div className="space-y-2">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {category.postCount}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">카테고리가 없습니다.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('인기 카테고리 위젯 로딩 오류:', error);
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          인기 카테고리
        </h3>
        <p className="text-sm text-muted-foreground">카테고리를 불러올 수 없습니다.</p>
      </div>
    );
  }
}
