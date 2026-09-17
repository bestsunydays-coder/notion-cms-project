/**
 * 태그 페이지
 * 특정 태그의 포스트를 필터링해서 표시하는 페이지입니다.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SkeletonCard from '@/components/SkeletonCard';
import TagBadge from '@/components/TagBadge';
import { getTags, getPostsByTag } from '@/lib/notion';
import { filterPublished, sortPosts, paginatePosts, calculateTotalPages } from '@/lib/utils/filter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowDown, ArrowUp } from 'lucide-react';

// ISR 캐싱 (1시간마다 재검증)
export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

/**
 * 정적 페이지 생성을 위한 모든 태그 경로 미리 생성
 */
export async function generateStaticParams() {
  const tags = await getTags();

  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.name),
  }));
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} - 태그 | Notion 여행 가이드 블로그`,
    description: `'${decodedTag}' 태그와 관련된 모든 여행 가이드와 팁을 확인하세요.`,
    openGraph: {
      title: `${decodedTag} - 태그 | Notion 여행 가이드 블로그`,
      description: `'${decodedTag}' 태그와 관련된 모든 여행 가이드와 팁을 확인하세요.`,
      type: 'website',
      url: `https://notion-cms.example.com/tags/${tag}`,
    },
    twitter: {
      card: 'summary',
      title: `${decodedTag} - 태그 | Notion 여행 가이드 블로그`,
      description: `'${decodedTag}' 태그와 관련된 모든 여행 가이드와 팁을 확인하세요.`,
    },
  };
}

/**
 * 포스트 목록을 표시하는 컴포넌트
 */
async function TagPosts({
  tag,
  currentPage = 1,
  sortBy = 'date-desc',
}: {
  tag: string;
  currentPage: number;
  sortBy: string;
}) {
  // 태그별 포스트 조회
  const posts = await getPostsByTag(decodeURIComponent(tag));

  // 발행된 포스트만 필터링
  let filteredPosts = filterPublished(posts);

  // 정렬
  const sortOptions = {
    'date-desc': 'date-desc' as const,
    'date-asc': 'date-asc' as const,
    'title-asc': 'title-asc' as const,
    'title-desc': 'title-desc' as const,
  };
  const validSort = Object.keys(sortOptions).includes(sortBy)
    ? (sortBy as keyof typeof sortOptions)
    : 'date-desc';

  filteredPosts = sortPosts(filteredPosts, sortOptions[validSort]);

  // 페이지당 6개씩 표시
  const pageSize = 6;
  const totalPages = calculateTotalPages(filteredPosts.length, pageSize);

  // 현재 페이지의 포스트만 필터링
  const paginatedPosts = paginatePosts(filteredPosts, currentPage, pageSize);

  return (
    <>
      {/* 포스트 목록 */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            이 태그에 포스트가 없습니다.
          </p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getPageUrl={(page) => {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            if (sortBy !== 'date-desc') {
              params.set('sort', sortBy);
            }
            return `/tags/${tag}?${params.toString()}`;
          }}
        />
      )}
    </>
  );
}

/**
 * 로딩 폴백
 */
function PostsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const searchParamsData = await searchParams;
  const currentPage = parseInt(searchParamsData.page || '1', 10);
  const sortBy = searchParamsData.sort || 'date-desc';
  const decodedTag = decodeURIComponent(tag);

  // 태그 정보 조회
  const tags = await getTags();
  const tagInfo = tags.find((t) => t.name.toLowerCase() === decodedTag.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm flex justify-center w-full">
        <nav className="max-w-6xl w-full px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-lg hover:opacity-80 transition-opacity">
            Notion 여행 가이드
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Link>

        {/* 태그 헤더 */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {decodedTag}
            </h1>
            {tagInfo && (
              <TagBadge tag={tagInfo.name} />
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            {tagInfo && tagInfo.postCount > 0
              ? `${tagInfo.postCount}개의 포스트`
              : '포스트가 없습니다'}
          </p>
        </section>

        {/* 정렬 옵션 */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 self-center">
            정렬:
          </span>
          <Link href={`/tags/${tag}?sort=date-desc`}>
            <Button
              variant={sortBy === 'date-desc' ? 'default' : 'outline'}
              size="sm"
              className="gap-1"
            >
              <ArrowDown className="h-3 w-3" />
              최신순
            </Button>
          </Link>
          <Link href={`/tags/${tag}?sort=date-asc`}>
            <Button
              variant={sortBy === 'date-asc' ? 'default' : 'outline'}
              size="sm"
              className="gap-1"
            >
              <ArrowUp className="h-3 w-3" />
              오래된순
            </Button>
          </Link>
          <Link href={`/tags/${tag}?sort=title-asc`}>
            <Button
              variant={sortBy === 'title-asc' ? 'default' : 'outline'}
              size="sm"
            >
              제목 A-Z
            </Button>
          </Link>
          <Link href={`/tags/${tag}?sort=title-desc`}>
            <Button
              variant={sortBy === 'title-desc' ? 'default' : 'outline'}
              size="sm"
            >
              제목 Z-A
            </Button>
          </Link>
        </div>

        {/* 포스트 목록 */}
        <Suspense fallback={<PostsLoading />}>
          <TagPosts tag={tag} currentPage={currentPage} sortBy={sortBy} />
        </Suspense>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border/50 mt-20 py-8 flex justify-center w-full">
        <div className="max-w-6xl w-full px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Notion 여행 가이드 블로그. Powered by Next.js & Notion API</p>
        </div>
      </footer>
    </div>
  );
}
