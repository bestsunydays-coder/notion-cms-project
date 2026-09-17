# 프로젝트 개발 규칙 (AI 에이전트용)

## 프로젝트 개요

- **목적**: Notion 기반 CMS를 사용하는 여행 블로그 플랫폼
- **기술 스택**: Next.js 15 (App Router), TypeScript (strict mode), Tailwind CSS v4, shadcn/ui, Notion API
- **경로 별칭**: `@/*`는 `./src/*`로 매핑됨
- **주요 소스**: Notion 데이터베이스 (단일 진실 공급원)

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈페이지
│   ├── layout.tsx         # 루트 레이아웃 (ThemeProvider 포함)
│   ├── globals.css        # 전역 스타일
│   └── favicon.ico
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트들
│   ├── theme-provider.tsx # 테마 제공자
│   └── theme-toggle.tsx   # 테마 토글 버튼
├── lib/
│   ├── notion.ts          # Notion API 통합 (구현 필수)
│   ├── types.ts           # Notion API 타입 정의
│   ├── utils.ts           # 유틸리티 함수
│   └── supabase.ts        # 현재 미사용 (추후 인증용)
docs/
├── PRD.md                 # 제품 명세 및 Notion 데이터베이스 스키마
└── ROADMAP.md             # 개발 로드맵 (5단계 계획)
```

### 데이터 흐름

1. **Notion 데이터베이스** → 원본 데이터 (Title, Category, Tags, Published, Status, Content)
2. **API 레이어** (`src/lib/notion.ts`) → Notion API 쿼리, 캐싱/ISR 전략
3. **페이지 컴포넌트** (`src/app/`) → 데이터 렌더링
4. **UI 컴포넌트** (`src/components/`) → shadcn/ui 기반 구성

---

## 코드 작성 표준

### 언어 규칙

- **주석**: 모두 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **변수명/함수명**: 영어만 사용 (코드 표준)
- **문서화**: 한국어로 작성

### TypeScript 규칙

- **strict mode 필수**: `tsconfig.json`에서 활성화됨
- **any 타입 금지**: 명시적 타입 정의 필수
- **타입 정의 위치**: `src/lib/types.ts`에 모든 Notion API 타입 정의
- **제네릭 활용**: 재사용 가능한 컴포넌트는 제네릭으로 작성

### 명명 규칙

- **파일명**: kebab-case (`theme-provider.tsx`, `notion.ts`)
- **컴포넌트명**: PascalCase (`ThemeProvider`, `PostCard`)
- **함수명**: camelCase (`fetchPosts`, `formatDate`)
- **상수명**: UPPER_SNAKE_CASE (`DATABASE_ID`, `API_KEY`)

### 주석 규칙

- **한국어로 작성**: 영어 금지
- **필요한 경우만**: WHY를 설명하는 경우만 (명확한 코드는 주석 불필요)
- **예**: `// Notion API의 rate limiting 때문에 캐싱 필수`

---

## Notion API 연동 표준

### 필수 구현 파일

- **`src/lib/notion.ts`** (아직 미구현): Notion API 클라이언트 구현
  - Notion 데이터베이스 쿼리 함수
  - 캐싱 전략 (ISR 또는 메모리 캐시)
  - Rate limiting 처리
  - 에러 핸들링

- **`src/lib/types.ts`**: Notion API 응답 타입 정의
  - Post, Category, Tag 인터페이스
  - Notion Block 타입들

### Notion 블록 렌더링

- 복잡한 Notion 블록 처리 필요 (텍스트, 이미지, 리스트, 코드 등)
- Phase 2 로드맵에서 `react-notion-x` 또는 유사 라이브러리 사용 예정
- **XSS 방지 필수**: 안전한 HTML 렌더링만 허용

### API 환경 변수

- **`.env.local` 필수**:
  - `NOTION_API_KEY` - Notion 통합 API 키
  - `NOTION_DATABASE_ID` - CMS 데이터베이스 ID

---

## 컴포넌트 & 스타일링 표준

### UI 컴포넌트

- **shadcn/ui 사용**: `npx shadcn@latest add [component-name]`
- **경로**: `src/components/ui/` 디렉토리
- **커스텀 컴포넌트 금지**: shadcn에 없으면 먼저 shadcn 확인
- **설치 전 확인**: 중복 설치 방지를 위해 기존 설치 여부 확인

### 스타일링 규칙

- **Tailwind CSS만 사용**: inline style 금지
- **클래스 병합**: `cn()` 유틸리티 사용 (`src/lib/utils.ts`)
- **다크 모드**: next-themes로 자동 처리됨
- **커스텀 CSS**: `globals.css`에만 작성 (필요한 경우)

### 테마 지원

- **ThemeProvider**: `src/components/theme-provider.tsx`로 감싸짐
- **테마 토글**: `ThemeToggle` 컴포넌트로 제공
- **동작**: next-themes가 자동으로 localStorage 관리

---

## 페이지 구조 & 라우팅

### 구현된 페이지

- **`/` (홈)**: `src/app/page.tsx` - 최근 게시물 목록 표시
- **`/posts/[slug]`** (구현 예정): 개별 게시물 상세 페이지
- **`/categories/[category]`** (구현 예정): 카테고리별 필터링 게시물
- **`/search`** (구현 예정): 클라이언트 사이드 검색

### 레이아웃 구조

- **`src/app/layout.tsx`**: 루트 레이아웃
  - ThemeProvider 래핑
  - 헤더/네비게이션 (구현 필요)
  - 기본 메타데이터 설정

---

## 파일 간 연동 규칙

### 다중 파일 동시 수정 필수 상황

#### 1. 기술 스택 변경 시
- **변경 대상**: `CLAUDE.md`, `AGENTS.md` (있을 경우), `package.json`
- **규칙**: 기술 스택 변경 후 즉시 `CLAUDE.md`의 "Tech Stack" 섹션 업데이트
- **예**: Next.js 버전 업그레이드 시 CLAUDE.md의 버전 정보 동시 수정

#### 2. 새 환경 변수 추가 시
- **변경 대상**: `.env.local`, `CLAUDE.md` (환경 변수 섹션)
- **규칙**: 새 환경 변수 추가 후 `.env.local` 예시와 설명을 CLAUDE.md에 기재

#### 3. 새 라우트 추가 시
- **변경 대상**: `CLAUDE.md`, 페이지 파일
- **규칙**: 새 라우트 추가 후 CLAUDE.md의 "페이지 구조" 섹션 업데이트

#### 4. 타입 구조 변경 시
- **변경 대상**: `src/lib/types.ts`, 사용하는 모든 파일
- **규칙**: 타입 변경 시 해당 타입을 사용하는 모든 컴포넌트/함수 확인 후 일관성 유지

---

## 워크플로우 표준

### 개발 프로세스

1. **환경 설정**: `.env.local` 작성 (Notion API 키 필수)
2. **개발 서버**: `npm run dev` (http://localhost:3000)
3. **코드 작성**: TypeScript strict mode 준수
4. **스타일**: Tailwind CSS로만 스타일링
5. **컴포넌트 추가**: shadcn/ui 사용
6. **테스트**: 브라우저에서 직접 테스트
7. **린트 확인**: `npm run lint` 실행
8. **커밋**: 한국어 메시지로 커밋 (`git commit -m "기능 설명"`)

### 빌드 및 배포

- **개발 빌드**: `npm run build`
- **프로덕션 서버**: `npm start`
- **린트 검사**: CI/CD에서 `npm run lint` 실행 (실패 시 머지 불가)

---

## 금지 사항 (Prohibitions)

### 엄격히 금지

- **`any` 타입 사용**: TypeScript strict mode 위반
- **inline style 작성**: Tailwind CSS로만 스타일링
- **커스텀 UI 컴포넌트**: shadcn/ui에 있는 것 우선 사용
- **영어 주석**: 모든 주석은 한국어로 작성
- **직접 스타일시트**: CSS/SCSS 파일 추가 금지 (Tailwind 사용)

### 권고하지 않음

- **Supabase 직접 사용**: 아직 인증 미구현 (추후 계획)
- **캐싱 없이 Notion API 호출**: Rate limiting 고려
- **XSS 취약점**: HTML 렌더링 시 항상 XSS 방지

---

## AI 의사결정 기준

### 모호한 상황에서의 판단

#### 1. UI 컴포넌트 선택
- **우선순위**: shadcn/ui 존재 여부 → 존재하면 사용 → 없으면 커스텀
- **확인 방법**: `src/components/ui/` 폴더 확인 또는 `npx shadcn@latest list`

#### 2. 캐싱 전략
- **원칙**: Notion API는 rate limiting이 있으므로 반드시 캐싱 적용
- **선택**: Phase 2 로드맵에 따라 ISR 또는 메모리 캐시

#### 3. 타입 정의 위치
- **원칙**: 모든 Notion API 응답 타입은 `src/lib/types.ts`에만 정의
- **금지**: 컴포넌트 파일 내 타입 정의 (재사용성 떨어짐)

#### 4. 환경 변수 추가
- **프로세스**: 환경 변수 추가 → `.env.local` 갱신 → CLAUDE.md 설명 추가 → 커밋

#### 5. Next.js 기능 사용
- **필수 확인**: `node_modules/next/dist/docs/` 참조 (Next.js 15는 breaking changes 있음)
- **참고 파일**: AGENTS.md에서 breaking changes 확인

---

## 로드맵 연동

- **Phase 1**: 초기 설정 (현재 진행 중) - 프로젝트 구조, 기본 레이아웃
- **Phase 2**: Notion API 통합 - 데이터 페칭, 캐싱, 블록 렌더링
- **Phase 3**: 콘텐츠 표시 - 홈페이지, 게시물 상세 페이지
- **Phase 4**: 검색/필터링 - 카테고리, 태그, 전체 검색
- **Phase 5**: 최적화 - 이미지 최적화, SEO, 성능 튜닝

**참고**: 각 phase별 구체적인 작업 내용은 `docs/ROADMAP.md` 참조

---

## 관련 문서

- **CLAUDE.md**: 프로젝트 전체 가이드라인 (개발자용)
- **docs/PRD.md**: 제품 명세 및 Notion 데이터베이스 스키마
- **docs/ROADMAP.md**: 5단계 개발 로드맵
- **AGENTS.md**: Next.js 15 breaking changes (있을 경우)
- **README.md**: 프로젝트 설정 및 시작 가이드

---

## 버전 정보

- **Next.js**: 15 (App Router)
- **TypeScript**: strict mode enabled
- **Tailwind CSS**: v4
- **shadcn/ui**: 최신 버전
- **Node.js**: v18 이상 권장

**마지막 업데이트**: 2026-09-17
