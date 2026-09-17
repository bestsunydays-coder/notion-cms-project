/**
 * Notion API 클라이언트
 * Notion 데이터베이스와의 상호작용을 담당합니다.
 * ISR(Incremental Static Regeneration) 캐싱 로직이 포함됩니다.
 */

import { Client } from '@notionhq/client';
import type {
  Post,
  Category,
  Tag,
  PostsResponse,
  FilterOptions,
  PaginationOptions,
} from './types';

// Notion 클라이언트 초기화
const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 데이터베이스 ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

// 캐시 저장소 (메모리 기반)
const cacheStore = new Map<string, { data: unknown; timestamp: number }>();

// ISR 캐시 시간 (초)
const CACHE_DURATION = {
  POSTS: 3600, // 1시간
  CATEGORIES: 3600, // 1시간
  TAGS: 3600, // 1시간
};

/**
 * 캐시 키 생성
 * @param prefix 캐시 키 접두사
 * @param params 매개변수
 * @returns 캐시 키
 */
function getCacheKey(prefix: string, params?: Record<string, unknown>): string {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${prefix}:${paramStr}`;
}

/**
 * 캐시에서 데이터 조회
 * @param key 캐시 키
 * @param duration 캐시 유지 시간 (초)
 * @returns 캐시된 데이터 또는 null
 */
function getFromCache<T>(key: string, duration: number): T | null {
  const cached = cacheStore.get(key);
  if (!cached) return null;

  // 캐시 만료 확인
  const now = Date.now();
  if (now - cached.timestamp > duration * 1000) {
    cacheStore.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * 캐시에 데이터 저장
 * @param key 캐시 키
 * @param data 저장할 데이터
 */
function setToCache(key: string, data: unknown): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Notion 페이지 ID를 포스트 객체로 변환
 * @param pageId 페이지 ID
 * @returns 포스트 객체
 */
async function pageToPost(pageId: string): Promise<Post> {
  try {
    // 페이지 조회
    const page = await notionClient.pages.retrieve({ page_id: pageId });

    // 페이지 타입 확인
    if (page.object !== 'page' || !('properties' in page)) {
      throw new Error('Invalid page object');
    }

    // 페이지 속성 추출 (Notion 데이터베이스 속성)
    const properties = page.properties as Record<string, unknown>;

    // 제목 추출
    let title = '제목 없음';
    if (properties.Title && typeof properties.Title === 'object') {
      const titleProp = properties.Title as { title?: Array<{ plain_text?: string }> };
      if (titleProp.title && titleProp.title[0]) {
        title = titleProp.title[0].plain_text || title;
      }
    }

    // 카테고리 추출
    let category = '미분류';
    if (properties.Category && typeof properties.Category === 'object') {
      const catProp = properties.Category as { select?: { name?: string } };
      if (catProp.select) {
        category = catProp.select.name || category;
      }
    }

    // 태그 추출
    let tags: string[] = [];
    if (properties.Tags && typeof properties.Tags === 'object') {
      const tagsProp = properties.Tags as { multi_select?: Array<{ name?: string }> };
      if (tagsProp.multi_select) {
        tags = tagsProp.multi_select
          .map((t) => t.name)
          .filter((t): t is string => typeof t === 'string');
      }
    }

    // 발행 날짜 추출
    let publishedDate: Date | null = null;
    if (properties.Published && typeof properties.Published === 'object') {
      const pubProp = properties.Published as { date?: { start?: string } };
      if (pubProp.date && pubProp.date.start) {
        publishedDate = new Date(pubProp.date.start);
      }
    }

    // 상태 추출
    let status: 'draft' | 'published' = 'draft';
    if (properties.Status && typeof properties.Status === 'object') {
      const statusProp = properties.Status as { select?: { name?: string } };
      if (statusProp.select && statusProp.select.name === 'published') {
        status = 'published';
      }
    }

    // 블록 콘텐츠 조회 (간단한 버전)
    const blocks: Post['content'] = [];

    return {
      id: pageId,
      title,
      category,
      tags,
      publishedDate,
      status,
      content: blocks,
    };
  } catch (error) {
    console.error(`포스트 변환 오류: ${pageId}`, error);
    throw error;
  }
}

/**
 * 모든 포스트 조회
 * @param options 필터 및 페이지네이션 옵션
 * @returns 포스트 목록
 */
export async function getPosts(
  filterOptions?: FilterOptions,
  paginationOptions?: PaginationOptions,
): Promise<PostsResponse> {
  try {
    // 캐시 키 생성
    const cacheKey = getCacheKey('posts', {
      filter: filterOptions,
      pagination: paginationOptions,
    });

    // 캐시 확인
    const cached = getFromCache<PostsResponse>(cacheKey, CACHE_DURATION.POSTS);
    if (cached) {
      return {
        ...cached,
        cache: { hit: true, createdAt: new Date() },
      };
    }

    // Notion 데이터베이스 쿼리
    const queryParams: {
      database_id: string;
      filter?: Record<string, unknown>;
      page_size?: number;
    } = {
      database_id: DATABASE_ID,
      page_size: paginationOptions?.pageSize || 10,
    };

    const filter = buildNotionFilter(filterOptions);
    if (filter) {
      queryParams.filter = filter;
    }

    // 타입 단언을 사용하여 query 메서드 호출
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notionClient.databases as any).query(queryParams);

    // 포스트 배열로 변환
    const posts: Post[] = [];
    for (const result of response.results) {
      if (result.object === 'page') {
        const post = await pageToPost(result.id);
        posts.push(post);
      }
    }

    const result: PostsResponse = {
      success: true,
      data: posts,
      total: response.results.length,
      page: paginationOptions?.page || 1,
      pageSize: paginationOptions?.pageSize || 10,
    };

    // 캐시 저장
    setToCache(cacheKey, result);

    return result;
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return {
      success: false,
      error: '포스트를 조회할 수 없습니다.',
    };
  }
}

/**
 * 특정 포스트 조회
 * @param postId 포스트 ID
 * @returns 포스트 객체
 */
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    // 캐시 확인
    const cacheKey = getCacheKey('post', { id: postId });
    const cached = getFromCache<Post>(cacheKey, CACHE_DURATION.POSTS);
    if (cached) return cached;

    // 포스트 조회
    const post = await pageToPost(postId);

    // 캐시 저장
    setToCache(cacheKey, post);

    return post;
  } catch (error) {
    console.error(`포스트 조회 오류: ${postId}`, error);
    return null;
  }
}

/**
 * 카테고리 목록 조회
 * @returns 카테고리 배열
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // 캐시 확인
    const cacheKey = getCacheKey('categories', {});
    const cached = getFromCache<Category[]>(cacheKey, CACHE_DURATION.CATEGORIES);
    if (cached) return cached;

    // 모든 포스트 조회하여 카테고리 추출
    const postsResponse = await getPosts();
    const categoryMap = new Map<string, number>();

    if (postsResponse.data) {
      for (const post of postsResponse.data) {
        const count = categoryMap.get(post.category) || 0;
        categoryMap.set(post.category, count + 1);
      }
    }

    // 카테고리 배열로 변환
    const categories: Category[] = Array.from(categoryMap.entries()).map(
      ([name, count], index) => ({
        id: `category-${index}`,
        name,
        postCount: count,
      }),
    );

    // 캐시 저장
    setToCache(cacheKey, categories);

    return categories;
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return [];
  }
}

/**
 * 태그 목록 조회
 * @returns 태그 배열
 */
export async function getTags(): Promise<Tag[]> {
  try {
    // 캐시 확인
    const cacheKey = getCacheKey('tags', {});
    const cached = getFromCache<Tag[]>(cacheKey, CACHE_DURATION.TAGS);
    if (cached) return cached;

    // 모든 포스트 조회하여 태그 추출
    const postsResponse = await getPosts();
    const tagMap = new Map<string, number>();

    if (postsResponse.data) {
      for (const post of postsResponse.data) {
        for (const tag of post.tags) {
          const count = tagMap.get(tag) || 0;
          tagMap.set(tag, count + 1);
        }
      }
    }

    // 태그 배열로 변환
    const tags: Tag[] = Array.from(tagMap.entries()).map(([name, count], index) => ({
      id: `tag-${index}`,
      name,
      postCount: count,
    }));

    // 캐시 저장
    setToCache(cacheKey, tags);

    return tags;
  } catch (error) {
    console.error('태그 조회 오류:', error);
    return [];
  }
}

/**
 * 특정 태그의 포스트 조회
 * @param tag 태그명
 * @returns 포스트 배열
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    // 캐시 확인
    const cacheKey = getCacheKey('posts_by_tag', { tag });
    const cached = getFromCache<Post[]>(cacheKey, CACHE_DURATION.POSTS);
    if (cached) return cached;

    // 모든 포스트 조회
    const postsResponse = await getPosts();

    if (!postsResponse.success || !postsResponse.data) {
      return [];
    }

    // 해당 태그를 가진 포스트만 필터링
    const posts = postsResponse.data.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );

    // 캐시 저장
    setToCache(cacheKey, posts);

    return posts;
  } catch (error) {
    console.error(`태그별 포스트 조회 오류: ${tag}`, error);
    return [];
  }
}

/**
 * Notion 필터 조건 생성
 * @param filterOptions 필터 옵션
 * @returns Notion 필터 객체
 */
function buildNotionFilter(filterOptions?: FilterOptions): Record<string, unknown> | undefined {
  if (!filterOptions) return undefined;

  const filters: Array<Record<string, unknown>> = [];

  // 상태 필터
  if (filterOptions.status) {
    filters.push({
      property: 'Status',
      select: {
        equals: filterOptions.status === 'published' ? 'published' : 'draft',
      },
    });
  }

  // 카테고리 필터
  if (filterOptions.category) {
    filters.push({
      property: 'Category',
      select: {
        equals: filterOptions.category,
      },
    });
  }

  // 태그 필터 (다중 선택)
  if (filterOptions.tags && filterOptions.tags.length > 0) {
    filters.push({
      property: 'Tags',
      multi_select: {
        contains: filterOptions.tags[0],
      },
    });
  }

  // 필터가 없으면 undefined 반환
  if (filters.length === 0) return undefined;

  // 여러 필터가 있으면 AND 연결
  if (filters.length === 1) {
    return filters[0];
  }

  return {
    and: filters,
  };
}

/**
 * 캐시 초기화 (개발용)
 */
export function clearCache(): void {
  cacheStore.clear();
}

/**
 * 특정 캐시 삭제 (개발용)
 * @param key 캐시 키
 */
export function deleteCacheKey(key: string): void {
  cacheStore.delete(key);
}
