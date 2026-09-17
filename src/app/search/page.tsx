/**
 * 검색 페이지
 * 클라이언트 사이드 검색으로 포스트를 찾을 수 있는 페이지입니다.
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchBar from '@/components/SearchBar';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SkeletonCard from '@/components/SkeletonCard';
import { getPosts } from '@/lib/notion';
import type { Post } from '@/lib/types';
import { filterPublished, searchPosts, paginatePosts, calculateTotalPages } from '@/lib/utils/filter';
import { ArrowLeft } from 'lucide-react';

/**
 * 검색 결과를 표시하는 컴포넌트
 */
function SearchResults() {
  // 검색 파라미터에서 검색어 추출
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // 상태
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);

        // Notion에서 포스트 조회
        const postsResponse = await getPosts();

        if (!postsResponse.success || !postsResponse.data) {
          setPosts([]);
          return;
        }

        // 발행된 포스트만 필터링
        let filtered = filterPublished(postsResponse.data);

        // 검색어로 필터링
        if (query.trim()) {
          filtered = searchPosts(filtered, query);
        }

        setPosts(filtered);
        setCurrentPage(1);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [query]);

  // 페이지당 6개씩 표시
  const pageSize = 6;
  const totalPages = calculateTotalPages(posts.length, pageSize);
  const paginatedPosts = paginatePosts(posts, currentPage, pageSize);

  return (
    <>
      {/* 검색 결과 정보 */}
      <div className="mb-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {query ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                "{query}"
              </span>
              {' '}에 대한 검색 결과:
              <span className="font-semibold text-primary ml-2">
                {posts.length}개
              </span>
            </>
          ) : (
            '검색어를 입력하세요.'
          )}
        </p>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* 검색 결과 */}
      {!loading && paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              getPageUrl={(page) => {
                const params = new URLSearchParams();
                params.set('q', query);
                params.set('page', page.toString());
                return `/search?${params.toString()}`;
              }}
            />
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {query
                ? `"${query}"에 해당하는 포스트를 찾을 수 없습니다.`
                : '검색 결과가 없습니다.'}
            </p>
          </div>
        )
      )}
    </>
  );
}

/**
 * 검색 페이지
 */
export default function SearchPage() {
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

        {/* 검색 섹션 */}
        <section className="mb-12 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              포스트 검색
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              제목, 요약, 태그, 카테고리로 포스트를 검색할 수 있습니다.
            </p>
          </div>

          {/* 검색 바 */}
          <SearchBar />
        </section>

        {/* 검색 결과 */}
        <Suspense fallback={null}>
          <SearchResults />
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
