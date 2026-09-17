/**
 * 고급 검색 유틸리티
 * 복잡한 검색 필터링과 자동완성 기능을 제공합니다.
 */

import type { Post } from '@/lib/types';

/**
 * 검색 필터 옵션 인터페이스
 */
export interface AdvancedSearchOptions {
  // 검색어
  query?: string;
  // 카테고리
  category?: string;
  // 태그 배열
  tags?: string[];
  // 시작 날짜
  fromDate?: Date;
  // 종료 날짜
  toDate?: Date;
  // 정렬 옵션 (관련도순, 최신순, 오래된순, 제목순)
  sortBy?: 'relevance' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
}

/**
 * 검색어가 텍스트에 포함되어 있는지 확인 (대소문자 무시)
 * @param text 검색 대상 텍스트
 * @param query 검색어
 * @returns 포함 여부
 */
function textMatches(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * 포스트와 검색어의 관련도를 점수로 계산
 * @param post 포스트 객체
 * @param query 검색어
 * @returns 관련도 점수 (0~100)
 */
function calculateRelevance(post: Post, query: string): number {
  let score = 0;

  // 제목에 정확한 단어 일치: 100점
  if (post.title.toLowerCase() === query.toLowerCase()) {
    score += 100;
  }
  // 제목에 포함: 80점
  else if (textMatches(post.title, query)) {
    score += 80;
  }

  // 카테고리에 포함: 30점
  if (textMatches(post.category, query)) {
    score += 30;
  }

  // 태그에 포함: 20점 * 태그 개수
  const matchingTags = post.tags.filter((tag) => textMatches(tag, query));
  score += matchingTags.length * 20;

  // 발췌에 포함: 10점
  if (post.excerpt && textMatches(post.excerpt, query)) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * 고급 검색 수행
 * @param posts 포스트 배열
 * @param options 검색 옵션
 * @returns 필터링되고 정렬된 포스트 배열
 */
export function performAdvancedSearch(
  posts: Post[],
  options: AdvancedSearchOptions,
): Post[] {
  let results = [...posts];

  // 1. 검색어로 필터링
  if (options.query && options.query.trim()) {
    const query = options.query.trim();
    results = results.filter((post) => {
      // 제목, 카테고리, 태그, 발췌에서 검색
      return (
        textMatches(post.title, query) ||
        textMatches(post.category, query) ||
        post.tags.some((tag) => textMatches(tag, query)) ||
        (post.excerpt && textMatches(post.excerpt, query))
      );
    });
  }

  // 2. 카테고리로 필터링
  if (options.category && options.category.trim()) {
    results = results.filter(
      (post) => post.category.toLowerCase() === options.category!.toLowerCase(),
    );
  }

  // 3. 태그로 필터링
  if (options.tags && options.tags.length > 0) {
    results = results.filter((post) =>
      options.tags!.some((filterTag) =>
        post.tags.some((postTag) => postTag.toLowerCase() === filterTag.toLowerCase()),
      ),
    );
  }

  // 4. 날짜 범위로 필터링
  if (options.fromDate) {
    results = results.filter((post) => {
      if (!post.publishedDate) return false;
      return post.publishedDate >= options.fromDate!;
    });
  }

  if (options.toDate) {
    // 종료 날짜는 포함하므로 다음 날 자정 이전으로 비교
    const endOfDay = new Date(options.toDate);
    endOfDay.setDate(endOfDay.getDate() + 1);
    results = results.filter((post) => {
      if (!post.publishedDate) return false;
      return post.publishedDate < endOfDay;
    });
  }

  // 5. 정렬
  const sortBy = options.sortBy || 'relevance';

  if (sortBy === 'relevance' && options.query && options.query.trim()) {
    // 관련도순: 검색어가 있을 때만 적용
    results.sort((a, b) => {
      const scoreA = calculateRelevance(a, options.query!);
      const scoreB = calculateRelevance(b, options.query!);

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // 같은 점수면 최신순
      const dateA = a.publishedDate?.getTime() || 0;
      const dateB = b.publishedDate?.getTime() || 0;
      return dateB - dateA;
    });
  } else if (sortBy === 'date-desc') {
    // 최신순
    results.sort((a, b) => {
      const dateA = a.publishedDate?.getTime() || 0;
      const dateB = b.publishedDate?.getTime() || 0;
      return dateB - dateA;
    });
  } else if (sortBy === 'date-asc') {
    // 오래된순
    results.sort((a, b) => {
      const dateA = a.publishedDate?.getTime() || 0;
      const dateB = b.publishedDate?.getTime() || 0;
      return dateA - dateB;
    });
  } else if (sortBy === 'title-asc') {
    // 제목 A-Z
    results.sort((a, b) => a.title.localeCompare(b.title, 'ko-KR'));
  } else if (sortBy === 'title-desc') {
    // 제목 Z-A
    results.sort((a, b) => b.title.localeCompare(a.title, 'ko-KR'));
  }

  return results;
}

/**
 * 자동완성 제안 생성
 * @param posts 포스트 배열
 * @param query 검색어
 * @param maxResults 최대 결과 개수 (기본값: 10)
 * @returns 제안 배열
 */
export function getAutocompleteSuggestions(
  posts: Post[],
  query: string,
  maxResults: number = 10,
): string[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  // 포스트 제목에서 제안 추출
  posts.forEach((post) => {
    if (post.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(post.title);
    }
  });

  // 카테고리에서 제안 추출
  posts.forEach((post) => {
    if (post.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(`카테고리: ${post.category}`);
    }
  });

  // 태그에서 제안 추출
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(`태그: ${tag}`);
      }
    });
  });

  // 배열로 변환 후 정렬
  const suggestionArray = Array.from(suggestions)
    .sort()
    .slice(0, maxResults);

  return suggestionArray;
}

/**
 * 쿼리 스트링 매개변수를 AdvancedSearchOptions로 변환
 * @param searchParams URL 검색 매개변수
 * @returns 검색 옵션 객체
 */
export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>): AdvancedSearchOptions {
  return {
    query: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    tags:
      typeof searchParams.tags === 'string'
        ? searchParams.tags.split(',').filter((t) => t.trim())
        : undefined,
    fromDate: typeof searchParams.from === 'string' ? new Date(searchParams.from) : undefined,
    toDate: typeof searchParams.to === 'string' ? new Date(searchParams.to) : undefined,
    sortBy: ((['relevance', 'date-desc', 'date-asc', 'title-asc', 'title-desc'].includes(
      typeof searchParams.sort === 'string' ? searchParams.sort : '',
    )
      ? searchParams.sort
      : 'relevance') as any) || undefined,
  };
}

/**
 * AdvancedSearchOptions를 쿼리 스트링으로 변환
 * @param options 검색 옵션 객체
 * @returns 쿼리 스트링
 */
export function buildSearchQueryString(options: AdvancedSearchOptions): string {
  const params = new URLSearchParams();

  if (options.query) params.set('q', options.query);
  if (options.category) params.set('category', options.category);
  if (options.tags && options.tags.length > 0) {
    params.set('tags', options.tags.join(','));
  }
  if (options.fromDate) {
    params.set('from', options.fromDate.toISOString().split('T')[0]);
  }
  if (options.toDate) {
    params.set('to', options.toDate.toISOString().split('T')[0]);
  }
  if (options.sortBy) {
    params.set('sort', options.sortBy);
  }

  return params.toString();
}
