/**
 * 홈 페이지
 * 최근 발행된 글을 표시하는 메인 페이지입니다.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchBar from '@/components/SearchBar';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SkeletonCard from '@/components/SkeletonCard';
import Sidebar from '@/components/Sidebar';
import { getPosts, getCategories } from '@/lib/notion';
import { filterPublished, sortPosts, paginatePosts, calculateTotalPages } from '@/lib/utils/filter';
import { Badge } from '@/components/ui/badge';

// 페이지 메타데이터
export const metadata: Metadata = {
  title: '홈 | Notion 여행 가이드 블로그',
  description: '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
  openGraph: {
    title: '홈 | Notion 여행 가이드 블로그',
    description: '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
    type: 'website',
    url: 'https://notion-cms.example.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '홈 | Notion 여행 가이드 블로그',
    description: '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
  },
};

// ISR 캐싱 (1시간마다 재검증)
export const revalidate = 3600;

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

/**
 * 포스트 목록을 표시하는 컴포넌트
 */
async function PostsList({
  currentPage = 1,
  selectedCategory = '',
}: {
  currentPage: number;
  selectedCategory?: string;
}) {
  // Notion에서 포스트 조회
  const postsResponse = await getPosts();

  if (!postsResponse.success || !postsResponse.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">포스트를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 발행된 포스트만 필터링
  let posts = filterPublished(postsResponse.data);

  // 카테고리 필터링
  if (selectedCategory) {
    posts = posts.filter((post) => post.category === selectedCategory);
  }

  // 최신 순으로 정렬
  posts = sortPosts(posts, 'date-desc');

  // 페이지당 6개씩 표시
  const pageSize = 6;
  const totalPages = calculateTotalPages(posts.length, pageSize);

  // 현재 페이지의 포스트만 필터링
  const paginatedPosts = paginatePosts(posts, currentPage, pageSize);

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
            {selectedCategory ? `${selectedCategory} 카테고리에 포스트가 없습니다.` : '포스트가 없습니다.'}
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
            if (selectedCategory) {
              params.set('category', selectedCategory);
            }
            return `/?${params.toString()}`;
          }}
        />
      )}
    </>
  );
}

/**
 * 카테고리 필터 컴포넌트
 */
async function CategoryFilter({ selectedCategory = '' }: { selectedCategory?: string }) {
  // 카테고리 목록 조회
  const categories = await getCategories();

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        카테고리 필터
      </p>
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 버튼 */}
        <Link href="/">
          <Badge
            variant={!selectedCategory ? 'default' : 'outline'}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            전체
          </Badge>
        </Link>

        {/* 카테고리 버튼 */}
        {categories.map((category) => (
          <Link key={category.id} href={`/?category=${encodeURIComponent(category.name)}`}>
            <Badge
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              {category.name} ({category.postCount})
            </Badge>
          </Link>
        ))}
      </div>
    </div>
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

export default async function Home({ searchParams }: HomePageProps) {
  // searchParams를 기다립니다 (Next.js 15)
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const selectedCategory = params.category || '';

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

      <main className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 히어로 섹션 */}
          <section className="mb-12 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                세계 여행 가이드
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                전 세계의 아름다운 여행지를 소개하고, 현지 문화와 여행 팁을 공유합니다.
              </p>
            </div>

            {/* 검색 바 */}
            <SearchBar />
          </section>

          {/* 카테고리 필터 */}
          <Suspense fallback={null}>
            <CategoryFilter selectedCategory={selectedCategory} />
          </Suspense>

          {/* 포스트 목록 */}
          <Suspense fallback={<PostsLoading />}>
            <PostsList currentPage={currentPage} selectedCategory={selectedCategory} />
          </Suspense>
        </div>

        {/* 사이드바 */}
        <Sidebar />
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
