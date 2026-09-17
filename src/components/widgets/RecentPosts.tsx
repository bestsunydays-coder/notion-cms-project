/**
 * 최근 글 위젯
 * 최신 발행된 포스트 5개를 표시하는 위젯입니다.
 */

import Link from 'next/link';
import { getPosts } from '@/lib/notion';
import { filterPublished, sortPosts } from '@/lib/utils/filter';
import { formatDateShort } from '@/lib/utils/date';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 최근 글 위젯 로딩 스켈레톤
 */
export function RecentPostsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * 최근 글 위젯
 */
export default async function RecentPosts() {
  try {
    // 포스트 조회
    const postsResponse = await getPosts();

    if (!postsResponse.success || !postsResponse.data) {
      throw new Error('포스트를 불러올 수 없습니다');
    }

    // 발행된 포스트만 필터링하고 날짜 기준으로 최신순 정렬
    let posts = filterPublished(postsResponse.data);
    posts = sortPosts(posts, 'date-desc');

    // 최근 5개만 선택
    const recentPosts = posts.slice(0, 5);

    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        {/* 헤더 */}
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          최근 글
        </h3>

        {/* 포스트 목록 */}
        {recentPosts.length > 0 ? (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block group"
              >
                <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.publishedDate && formatDateShort(post.publishedDate)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">포스트가 없습니다.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('최근 글 위젯 로딩 오류:', error);
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight mb-4">
          최근 글
        </h3>
        <p className="text-sm text-muted-foreground">포스트를 불러올 수 없습니다.</p>
      </div>
    );
  }
}
