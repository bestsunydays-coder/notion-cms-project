/**
 * Notion API 응답 타입 정의
 * Notion 데이터베이스의 구조를 TypeScript로 정의합니다.
 */

// 환경 변수 타입
export interface NotionEnv {
  notionApiKey: string;
  notionDatabaseId: string;
}

// 포스트 데이터 타입
export interface Post {
  // 고유 ID (Notion 페이지 ID)
  id: string;
  // 포스트 제목
  title: string;
  // 포스트 카테고리
  category: string;
  // 포스트 태그 배열
  tags: string[];
  // 발행 날짜
  publishedDate: Date | null;
  // 포스트 상태 (draft | published)
  status: 'draft' | 'published';
  // 포스트 콘텐츠 (Notion 블록 배열)
  content: NotionBlock[];
  // 포스트 요약
  excerpt?: string;
  // 썸네일 이미지 URL
  thumbnail?: string;
  // 조회수
  views?: number;
  // 작성자
  author?: string;
}

// Notion 블록 타입 (기본 구조)
export interface NotionBlock {
  // 블록 ID
  id: string;
  // 블록 타입 (paragraph, heading_1, image, code 등)
  type: string;
  // 블록 내용 (타입에 따라 다름)
  content?: string;
  // 부가 정보 (이미지 URL, 코드 언어 등)
  metadata?: Record<string, unknown>;
}

// 카테고리 타입
export interface Category {
  // 카테고리 ID
  id: string;
  // 카테고리 이름
  name: string;
  // 카테고리에 속한 포스트 개수
  postCount: number;
}

// 태그 타입
export interface Tag {
  // 태그 ID
  id: string;
  // 태그 이름
  name: string;
  // 태그가 붙은 포스트 개수
  postCount: number;
}

// API 응답 타입 (공통)
export interface ApiResponse<T> {
  // 성공 여부
  success: boolean;
  // 반환 데이터
  data?: T;
  // 에러 메시지
  error?: string;
  // 캐시 정보
  cache?: {
    // 캐시 존재 여부
    hit: boolean;
    // 캐시 생성 시간
    createdAt?: Date;
  };
}

// 포스트 목록 응답
export interface PostsResponse extends ApiResponse<Post[]> {
  data?: Post[];
  // 전체 포스트 개수
  total?: number;
  // 현재 페이지
  page?: number;
  // 페이지당 포스트 개수
  pageSize?: number;
}

// 페이지네이션 옵션
export interface PaginationOptions {
  // 현재 페이지 (1부터 시작)
  page: number;
  // 페이지당 항목 개수
  pageSize: number;
}

// 필터 옵션
export interface FilterOptions {
  // 카테고리로 필터링
  category?: string;
  // 태그로 필터링
  tags?: string[];
  // 상태로 필터링 (draft | published)
  status?: 'draft' | 'published';
  // 검색어
  searchQuery?: string;
}

// 캐시 메타데이터
export interface CacheMetadata {
  // 캐시 생성 시간
  createdAt: Date;
  // 캐시 만료 시간 (밀리초)
  expiresIn: number;
  // 캐시 키
  key: string;
}
