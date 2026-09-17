/**
 * 태그 클라우드 위젯
 * 모든 태그를 클라우드 형태로 표시하는 위젯입니다.
 */

import Link from 'next/link';
import { getTags } from '@/lib/notion';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 태그 클라우드 위젯 로딩 스켈레톤
 */
export function TagCloudSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-16 rounded-full" />
      ))}
    </div>
  );
}

/**
 * 태그 크기 계산 (최소 12px, 최대 24px)
 * @param count 태그가 붙은 포스트 개수
 * @param minCount 최소 개수
 * @param maxCount 최대 개수
 * @returns 폰트 사이즈
 */
function getTagSize(count: number, minCount: number, maxCount: number): string {
  const minSize = 12;
  const maxSize = 24;

  if (maxCount === minCount) {
    return `${minSize}px`;
  }

  const ratio = (count - minCount) / (maxCount - minCount);
  const size = minSize + ratio * (maxSize - minSize);

  return `${Math.round(size)}px`;
}

/**
 * 태그 클라우드 위젯
 */
export default async function TagCloud() {
  try {
    // 태그 조회
    const tags = await getTags();

    // 태그 크기 계산을 위해 최소/최대 포스트 개수 추출
    if (tags.length === 0) {
      return (
        <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            태그
          </h3>
          <p className="text-sm text-muted-foreground">태그가 없습니다.</p>
        </div>
      );
    }

    const counts = tags.map((t) => t.postCount);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    // 태그를 무작위로 섞기 (더 자연스러운 클라우드 모양)
    const shuffledTags = [...tags].sort(() => Math.random() - 0.5);

    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        {/* 헤더 */}
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          태그
        </h3>

        {/* 태그 클라우드 */}
        <div className="flex flex-wrap gap-3">
          {shuffledTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="inline-block px-3 py-1 rounded-full border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
              style={{
                fontSize: getTagSize(tag.postCount, minCount, maxCount),
              }}
              title={`${tag.postCount}개의 포스트`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('태그 클라우드 위젯 로딩 오류:', error);
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          태그
        </h3>
        <p className="text-sm text-muted-foreground">태그를 불러올 수 없습니다.</p>
      </div>
    );
  }
}
