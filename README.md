# 여행 가이드 블로그

Notion을 CMS로 활용한 개인 여행 블로그입니다. Notion 데이터베이스에서 글을 작성하면 자동으로 블로그에 반영됩니다.

## ✨ 주요 기능

- 📚 **Notion API 연동**: Notion 데이터베이스에서 자동으로 글 데이터 조회
- 🏷️ **카테고리별 필터링**: 여행 지역별로 글을 분류하여 표시
- 🔍 **검색 기능**: 제목 및 태그를 기반으로 한 빠른 검색
- 📱 **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- 🎨 **아름다운 UI**: shadcn/ui와 Tailwind CSS로 제작

## 🛠️ 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [lucide-react](https://lucide.dev)
- **CMS**: [Notion API](https://developers.notion.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (다크모드 지원)

## 📦 설치 및 실행

### 전제 조건

- Node.js 18.17.0 이상
- Notion 계정 및 API 키
- Notion 데이터베이스 ID

### 의존성 설치

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 브라우저에서 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

### 린트 확인

```bash
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # Root layout (ThemeProvider 적용)
│   ├── page.tsx                # 홈페이지 (최근 글 목록)
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx        # 글 상세 페이지
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx        # 카테고리별 글 목록 페이지
│   ├── search/
│   │   └── page.tsx            # 검색 결과 페이지
│   └── globals.css             # 전역 스타일
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── theme-provider.tsx      # next-themes 래퍼
│   └── theme-toggle.tsx        # 다크모드 토글 버튼
├── lib/
│   ├── notion.ts               # Notion API 클라이언트 및 쿼리 함수
│   ├── utils.ts                # cn() 헬퍼 함수
│   └── types.ts                # TypeScript 타입 정의
└── docs/
    └── PRD.md                  # 프로젝트 요구사항 정의서
```

## 📋 Notion 데이터베이스 구조

블로그 글을 관리하기 위한 Notion 데이터베이스 필드:

| 필드명 | 타입 | 설명 |
|-------|------|------|
| **Title** | Title | 블로그 글의 제목 |
| **Category** | Select | 여행 지역 분류 (예: 아시아, 유럽) |
| **Tags** | Multi Select | 관련 태그 (여행지, 경험 등) |
| **Published** | Date | 글 발행 날짜 |
| **Status** | Select | 초안(Draft) / 발행됨(Published) |
| **Content** | Page Content | 글의 본문 내용 |

## 🚀 Notion API 설정

### 1. Notion 데이터베이스 생성

1. [Notion](https://www.notion.so)에 로그인합니다
2. 새 페이지 생성 후 "Database" → "Table"을 선택합니다
3. 위의 "Notion 데이터베이스 구조" 섹션에 따라 필드를 추가합니다

### 2. Notion API 키 발급

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 "New Integration" 생성
2. 생성된 Integration의 "Internal Integration Token"을 복사
3. `.env.local`의 `NOTION_API_KEY`에 붙여넣습니다

### 3. 데이터베이스 ID 확인

1. Notion 데이터베이스 URL에서 `/database/` 뒤의 문자열이 ID입니다
   - 예: `https://www.notion.so/...?v=abc123def456...` → ID는 `abc123def456...`
2. `.env.local`의 `NOTION_DATABASE_ID`에 입력합니다

### 4. Integration에 데이터베이스 액세스 권한 부여

1. Notion 데이터베이스 페이지에서 "Share" 클릭
2. 생성한 Integration을 초대합니다

## 🎨 shadcn/ui 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 추가하려면:

```bash
npx shadcn@latest add [component-name]
```

더 많은 컴포넌트는 [shadcn/ui 문서](https://ui.shadcn.com)에서 확인하세요.

## 🌓 다크모드

애플리케이션은 기본적으로 시스템 테마를 따르며, 우측 상단의 토글 버튼으로 수동으로 변경할 수 있습니다.

## 📚 추가 문서

- [PRD (Product Requirements Document)](./docs/PRD.md) - 전체 프로젝트 요구사항 정의서

## 📝 설정 파일

- `next.config.ts` - Next.js 설정
- `tsconfig.json` - TypeScript 설정
- `components.json` - shadcn/ui 설정
- `postcss.config.mjs` - PostCSS 설정
- `eslint.config.mjs` - ESLint 설정

## 🚀 배포

Vercel에 배포하는 것이 가장 간단합니다:

1. [GitHub](https://github.com)에 저장소를 생성합니다.
2. [Vercel](https://vercel.com)에 로그인합니다.
3. 저장소를 선택하고 배포합니다.

더 자세한 배포 가이드는 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.

## 📚 학습 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
