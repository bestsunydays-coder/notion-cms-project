/**
 * 관련 글 추천 알고리즘
 * 현재 포스트와 유사한 포스트들을 추천하는 유틸리티입니다.
 */

import type { Post } from '@/lib/types';

/**
 * 추천 점수 계산을 위한 인터페이스
 */
interface ScoredPost {
  post: Post;
  score: number;
  reason: string;
}

/**
 * 두 포스트 간의 공통 태그 개수 계산
 * @param post1 첫 번째 포스트
 * @param post2 두 번째 포스트
 * @returns 공통 태그 개수
 */
function calculateCommonTags(post1: Post, post2: Post): number {
  return post1.tags.filter((tag) =>
    post2.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  ).length;
}

/**
 * 관련 글 추천
 * 우선순위 기반으로 포스트와 유사한 글들을 추천합니다.
 * @param currentPost 현재 포스트
 * @param allPosts 모든 포스트 배열
 * @param maxResults 반환할 최대 포스트 개수 (기본값: 6)
 * @returns 추천 포스트 배열
 */
export function getRelatedPosts(
  currentPost: Post,
  allPosts: Post[],
  maxResults: number = 6,
): Post[] {
  // 현재 포스트를 제외한 발행된 포스트만 필터링
  const candidates = allPosts.filter(
    (post) =>
      post.id !== currentPost.id &&
      post.status === 'published' &&
      currentPost.status === 'published',
  );

  // 각 후보 포스트에 점수 매기기
  const scoredPosts: ScoredPost[] = candidates.map((post) => {
    let score = 0;
    let reason = '';

    // 우선순위 1: 같은 카테고리 (가장 높은 점수)
    if (post.category.toLowerCase() === currentPost.category.toLowerCase()) {
      score = 100;
      reason = '같은 카테고리';
    } else {
      // 우선순위 2, 3: 공통 태그 기반
      const commonTags = calculateCommonTags(currentPost, post);

      if (commonTags >= 3) {
        // 공통 태그 3개 이상: 중간-높은 점수
        score = 60 + commonTags * 5;
        reason = `공통 태그 ${commonTags}개`;
      } else if (commonTags >= 1) {
        // 공통 태그 1-2개: 낮은 점수
        score = 20 + commonTags * 5;
        reason = `공통 태그 ${commonTags}개`;
      }
    }

    return {
      post,
      score,
      reason,
    };
  });

  // 점수 기준으로 내림차순 정렬
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 점수가 같으면 최신순
    const aDate = a.post.publishedDate?.getTime() || 0;
    const bDate = b.post.publishedDate?.getTime() || 0;
    return bDate - aDate;
  });

  // 요청한 개수만큼 반환 (점수가 0 이상인 것만)
  return scoredPosts.filter((sp) => sp.score > 0).slice(0, maxResults).map((sp) => sp.post);
}

/**
 * 추천 점수와 함께 관련 글 반환 (디버깅 용도)
 * @param currentPost 현재 포스트
 * @param allPosts 모든 포스트 배열
 * @param maxResults 반환할 최대 포스트 개수
 * @returns 점수와 함께 반환된 포스트 배열
 */
export function getRelatedPostsWithScore(
  currentPost: Post,
  allPosts: Post[],
  maxResults: number = 6,
): ScoredPost[] {
  // 현재 포스트를 제외한 발행된 포스트만 필터링
  const candidates = allPosts.filter(
    (post) =>
      post.id !== currentPost.id &&
      post.status === 'published' &&
      currentPost.status === 'published',
  );

  // 각 후보 포스트에 점수 매기기
  const scoredPosts: ScoredPost[] = candidates.map((post) => {
    let score = 0;
    let reason = '';

    // 우선순위 1: 같은 카테고리
    if (post.category.toLowerCase() === currentPost.category.toLowerCase()) {
      score = 100;
      reason = '같은 카테고리';
    } else {
      // 우선순위 2, 3: 공통 태그 기반
      const commonTags = calculateCommonTags(currentPost, post);

      if (commonTags >= 3) {
        score = 60 + commonTags * 5;
        reason = `공통 태그 ${commonTags}개`;
      } else if (commonTags >= 1) {
        score = 20 + commonTags * 5;
        reason = `공통 태그 ${commonTags}개`;
      }
    }

    return {
      post,
      score,
      reason,
    };
  });

  // 점수 기준으로 내림차순 정렬
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const aDate = a.post.publishedDate?.getTime() || 0;
    const bDate = b.post.publishedDate?.getTime() || 0;
    return bDate - aDate;
  });

  // 요청한 개수만큼 반환 (점수가 0 이상인 것만)
  return scoredPosts.filter((sp) => sp.score > 0).slice(0, maxResults);
}
