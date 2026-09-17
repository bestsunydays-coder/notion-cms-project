# API 문서

Notion CMS 블로그의 데이터 API 문서입니다.

## 개요

Notion API를 통해 데이터를 조회하고 관리합니다.

## 주요 함수

### getPosts()
모든 발행된 포스트를 조회합니다.

```typescript
const response = await getPosts();
// {
//   success: boolean;
//   data?: Post[];
//   error?: string;
// }
```

### getPostById(id)
특정 포스트를 ID로 조회합니다.

```typescript
const post = await getPostById('post-id-123');
// Post | null
```

### getCategories()
모든 카테고리를 조회합니다.

```typescript
const categories = await getCategories();
// Category[]
```

### getTags()
모든 태그를 조회합니다.

```typescript
const tags = await getTags();
// string[]
```

## 데이터 구조

### Post
```typescript
interface Post {
  id: string;              // 포스트 고유 ID
  title: string;           // 포스트 제목
  excerpt: string;         // 포스트 요약
  category: string;        // 카테고리
  tags: string[];          // 태그 배열
  thumbnail: string;       // 썸네일 이미지 URL
  publishedDate: Date;     // 발행일
  author: string;          // 작성자
  views: number;           // 조회수
  content: NotionBlock[];  // 포스트 콘텐츠
}
```

### NotionBlock
```typescript
interface NotionBlock {
  id: string;              // 블록 ID
  type: BlockType;         // 블록 타입
  content: string;         // 블록 내용
  metadata?: Record<string, unknown>;  // 추가 메타데이터
}
```

## 캐싱 전략

### ISR (Incremental Static Regeneration)
- 홈페이지: 3600초 (1시간)
- 포스트 상세: 3600초 (1시간)
- 카테고리/태그: 3600초 (1시간)

이를 통해 Notion 변경사항이 1시간 이내에 배포됩니다.

## 에러 처리

모든 API 호출은 에러를 처리하도록 작성되었습니다.

```typescript
const response = await getPosts();
if (!response.success) {
  console.error('포스트 조회 실패:', response.error);
  // 대체 콘텐츠 표시
}
```

## 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 자동 변환
- 반응형 이미지 크기 설정

### 번들 크기 최적화
```bash
npm run analyze
```

분석 결과를 검토하여 불필요한 의존성을 제거하세요.

## 제한사항

- Notion API 속도 제한 (분당 요청 수 제한)
- ISR로 1시간 단위 캐싱
- 동시 요청 처리

## 추가 리소스

- [Notion API 문서](https://developers.notion.com/)
- [Next.js 데이터 페칭](https://nextjs.org/docs/app/building-your-application/data-fetching)
