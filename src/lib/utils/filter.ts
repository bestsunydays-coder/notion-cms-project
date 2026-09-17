/**
 * 필터링 유틸리티
 * 포스트 배열을 카테고리, 태그, 상태 등으로 필터링합니다.
 */

import type { Post } from '@/lib/types';

/**
 * 포스트 배열을 카테고리로 필터링
 * @param posts 포스트 배열
 * @param category 카테고리명
 * @returns 필터링된 포스트 배열
 */
export function filterByCategory(posts: Post[], category: string): Post[] {
  if (!category) return posts;
  return posts.filter((post) => post.category === category);
}

/**
 * 포스트 배열을 카테고리 목록으로 필터링
 * @param posts 포스트 배열
 * @param categories 카테고리명 배열
 * @returns 필터링된 포스트 배열
 */
export function filterByCategories(posts: Post[], categories: string[]): Post[] {
  if (categories.length === 0) return posts;
  return posts.filter((post) => categories.includes(post.category));
}

/**
 * 포스트 배열을 태그로 필터링
 * @param posts 포스트 배열
 * @param tag 태그명
 * @returns 필터링된 포스트 배열
 */
export function filterByTag(posts: Post[], tag: string): Post[] {
  if (!tag) return posts;
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * 포스트 배열을 태그 목록으로 필터링 (AND 조건)
 * @param posts 포스트 배열
 * @param tags 태그명 배열
 * @returns 필터링된 포스트 배열
 */
export function filterByTags(posts: Post[], tags: string[]): Post[] {
  if (tags.length === 0) return posts;
  return posts.filter((post) =>
    tags.every((tag) => post.tags.includes(tag)),
  );
}

/**
 * 포스트 배열을 상태로 필터링
 * @param posts 포스트 배열
 * @param status 상태 (draft | published)
 * @returns 필터링된 포스트 배열
 */
export function filterByStatus(
  posts: Post[],
  status: 'draft' | 'published',
): Post[] {
  return posts.filter((post) => post.status === status);
}

/**
 * 포스트 배열을 발행 여부로 필터링
 * @param posts 포스트 배열
 * @returns 발행된 포스트만 필터링
 */
export function filterPublished(posts: Post[]): Post[] {
  return filterByStatus(posts, 'published');
}

/**
 * 포스트 배열을 초안으로 필터링
 * @param posts 포스트 배열
 * @returns 초안 포스트만 필터링
 */
export function filterDrafts(posts: Post[]): Post[] {
  return filterByStatus(posts, 'draft');
}

/**
 * 포스트 배열을 날짜 범위로 필터링
 * @param posts 포스트 배열
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 * @returns 필터링된 포스트 배열
 */
export function filterByDateRange(
  posts: Post[],
  startDate: Date,
  endDate: Date,
): Post[] {
  return posts.filter((post) => {
    if (!post.publishedDate) return false;
    return post.publishedDate >= startDate && post.publishedDate <= endDate;
  });
}

/**
 * 포스트 배열을 검색어로 필터링 (제목, 요약, 태그 포함)
 * @param posts 포스트 배열
 * @param searchQuery 검색어
 * @param caseSensitive 대소문자 구분 (기본값: false)
 * @returns 필터링된 포스트 배열
 */
export function searchPosts(
  posts: Post[],
  searchQuery: string,
  caseSensitive: boolean = false,
): Post[] {
  if (!searchQuery.trim()) return posts;

  const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();

  return posts.filter((post) => {
    // 제목 검색
    const titleMatch = caseSensitive
      ? post.title.includes(query)
      : post.title.toLowerCase().includes(query);

    if (titleMatch) return true;

    // 요약 검색
    if (post.excerpt) {
      const excerptMatch = caseSensitive
        ? post.excerpt.includes(query)
        : post.excerpt.toLowerCase().includes(query);
      if (excerptMatch) return true;
    }

    // 태그 검색
    const tagMatch = post.tags.some((tag) =>
      caseSensitive ? tag.includes(query) : tag.toLowerCase().includes(query),
    );
    if (tagMatch) return true;

    // 카테고리 검색
    const categoryMatch = caseSensitive
      ? post.category.includes(query)
      : post.category.toLowerCase().includes(query);
    if (categoryMatch) return true;

    return false;
  });
}

/**
 * 포스트 배열을 정렬
 * @param posts 포스트 배열
 * @param sortBy 정렬 기준 (date-desc | date-asc | title-asc | title-desc | views-desc)
 * @returns 정렬된 포스트 배열
 */
export function sortPosts(
  posts: Post[],
  sortBy: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'views-desc' = 'date-desc',
): Post[] {
  const sorted = [...posts];

  switch (sortBy) {
    // 발행일 최신 순
    case 'date-desc':
      sorted.sort((a, b) => {
        if (!a.publishedDate || !b.publishedDate) return 0;
        return b.publishedDate.getTime() - a.publishedDate.getTime();
      });
      break;

    // 발행일 오래된 순
    case 'date-asc':
      sorted.sort((a, b) => {
        if (!a.publishedDate || !b.publishedDate) return 0;
        return a.publishedDate.getTime() - b.publishedDate.getTime();
      });
      break;

    // 제목 가나다 순
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
      break;

    // 제목 역순
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title, 'ko'));
      break;

    // 조회수 내림차순
    case 'views-desc':
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;

    default:
      return sorted;
  }

  return sorted;
}

/**
 * 포스트 배열을 페이지네이션
 * @param posts 포스트 배열
 * @param page 페이지 번호 (1부터 시작)
 * @param pageSize 페이지당 항목 개수
 * @returns 페이지화된 포스트 배열
 */
export function paginatePosts(
  posts: Post[],
  page: number = 1,
  pageSize: number = 10,
): Post[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return posts.slice(start, end);
}

/**
 * 전체 페이지 수 계산
 * @param totalCount 전체 항목 개수
 * @param pageSize 페이지당 항목 개수
 * @returns 전체 페이지 수
 */
export function calculateTotalPages(totalCount: number, pageSize: number): number {
  return Math.ceil(totalCount / pageSize);
}

/**
 * 포스트 배열에서 복합 필터링 및 정렬 수행
 * @param posts 포스트 배열
 * @param options 필터 옵션
 * @returns 필터링되고 정렬된 포스트 배열
 */
export function applyFilters(
  posts: Post[],
  options: {
    category?: string;
    tags?: string[];
    status?: 'draft' | 'published';
    searchQuery?: string;
    sortBy?: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'views-desc';
    page?: number;
    pageSize?: number;
  },
): {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  let filtered = [...posts];

  // 상태 필터링
  if (options.status) {
    filtered = filterByStatus(filtered, options.status);
  }

  // 카테고리 필터링
  if (options.category) {
    filtered = filterByCategory(filtered, options.category);
  }

  // 태그 필터링
  if (options.tags && options.tags.length > 0) {
    filtered = filterByTags(filtered, options.tags);
  }

  // 검색어 필터링
  if (options.searchQuery) {
    filtered = searchPosts(filtered, options.searchQuery);
  }

  // 정렬
  if (options.sortBy) {
    filtered = sortPosts(filtered, options.sortBy);
  }

  const total = filtered.length;
  const pageSize = options.pageSize || 10;
  const page = options.page || 1;
  const totalPages = calculateTotalPages(total, pageSize);

  // 페이지네이션
  const paginated = paginatePosts(filtered, page, pageSize);

  return {
    posts: paginated,
    total,
    page,
    pageSize,
    totalPages,
  };
}
