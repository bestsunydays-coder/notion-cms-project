/**
 * 검색 페이지
 * 고급 검색 필터와 정렬 옵션을 제공하는 검색 페이지입니다.
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchBar from '@/components/SearchBar';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SkeletonCard from '@/components/SkeletonCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPosts, getCategories, getTags } from '@/lib/notion';
import type { Post, Category, Tag } from '@/lib/types';
import { filterPublished, paginatePosts, calculateTotalPages } from '@/lib/utils/filter';
import { performAdvancedSearch, buildSearchQueryString, type AdvancedSearchOptions } from '@/lib/utils/search';
import { ArrowLeft, X } from 'lucide-react';

/**
 * 검색 결과를 표시하는 컴포넌트
 */
function SearchResults() {
  // 검색 파라미터 추출
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const tagsParam = searchParams.get('tags') || '';
  const fromDate = searchParams.get('from') || '';
  const toDate = searchParams.get('to') || '';
  const sortBy = (searchParams.get('sort') || 'relevance') as any;
  const pageParam = searchParams.get('page') || '1';

  // 상태
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam, 10));

  // 선택된 필터들
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagsParam ? tagsParam.split(',').filter((t) => t.trim()) : [],
  );

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Notion에서 포스트, 카테고리, 태그 조회
        const [postsResponse, categoriesData, tagsData] = await Promise.all([
          getPosts(),
          getCategories(),
          getTags(),
        ]);

        if (!postsResponse.success || !postsResponse.data) {
          setPosts([]);
          return;
        }

        // 발행된 포스트만 필터링
        let filtered = filterPublished(postsResponse.data);

        // 고급 검색 수행
        const searchOptions: AdvancedSearchOptions = {
          query: query || undefined,
          category: category || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          fromDate: fromDate ? new Date(fromDate) : undefined,
          toDate: toDate ? new Date(toDate) : undefined,
          sortBy,
        };

        filtered = performAdvancedSearch(filtered, searchOptions);

        setPosts(filtered);
        setCategories(categoriesData);
        setAllTags(tagsData);
        setCurrentPage(1);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [query, category, tagsParam, fromDate, toDate, sortBy]);

  // 태그 필터 토글
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (newTags.length > 0) params.set('tags', newTags.join(','));
    if (fromDate) params.set('from', fromDate);
    if (toDate) params.set('to', toDate);
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);

    window.history.replaceState({}, '', `/search?${params.toString()}`);
    setSelectedTags(newTags);
  };

  // 필터 초기화
  const clearFilters = () => {
    window.history.replaceState({}, '', '/search');
  };

  // 페이지당 6개씩 표시
  const pageSize = 6;
  const totalPages = calculateTotalPages(posts.length, pageSize);
  const paginatedPosts = paginatePosts(posts, currentPage, pageSize);

  return (
    <>
      {/* 검색 필터 */}
      <div className="mb-8 space-y-4">
        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/search?category=${encodeURIComponent(cat.name)}`}>
                  <Badge
                    variant={category === cat.name ? 'default' : 'outline'}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 태그 필터 */}
        {allTags.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              태그
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 정렬 옵션 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            정렬
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'relevance', label: '관련도순' },
              { value: 'date-desc', label: '최신순' },
              { value: 'date-asc', label: '오래된순' },
              { value: 'title-asc', label: '제목 A-Z' },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/search?q=${query}${category ? `&category=${category}` : ''}${
                  selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : ''
                }${option.value !== 'relevance' ? `&sort=${option.value}` : ''}`}
              >
                <Button
                  variant={sortBy === option.value ? 'default' : 'outline'}
                  size="sm"
                >
                  {option.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* 필터 초기화 */}
        {(query || category || selectedTags.length > 0 || fromDate || toDate) && (
          <Button variant="secondary" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* 검색 결과 정보 */}
      <div className="mb-8 p-4 rounded-lg bg-primary/5">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {query || category || selectedTags.length > 0 ? (
            <>
              검색 결과:
              <span className="font-semibold text-primary ml-2">
                {posts.length}개
              </span>
            </>
          ) : (
            '검색어나 필터를 선택하세요.'
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
                if (query) params.set('q', query);
                if (category) params.set('category', category);
                if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
                if (fromDate) params.set('from', fromDate);
                if (toDate) params.set('to', toDate);
                if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);
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
              검색 조건에 맞는 포스트를 찾을 수 없습니다.
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
