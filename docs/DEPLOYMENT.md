# 배포 가이드

이 문서는 Notion CMS 블로그를 프로덕션 환경에 배포하는 방법을 설명합니다.

## 1. 사전 준비

### 1.1 필요한 계정 및 서비스
- **GitHub** - 소스 코드 호스팅
- **Vercel** - 호스팅 및 자동 배포
- **Notion** - CMS 데이터베이스
- **Google Analytics** (선택) - 사용자 분석

### 1.2 필요한 정보 수집

#### Notion API 정보
1. Notion 계정에서 [Integrations](https://www.notion.com/my-integrations) 접속
2. "새 인테그레이션 생성" 클릭
3. 이름 입력: `Notion CMS Blog`
4. 인테그레이션 토큰 복사 (NOTION_API_KEY)
5. 공유할 데이터베이스 설정

#### 데이터베이스 ID
1. Notion 블로그 데이터베이스 URL 확인: `https://notion.so/a1b2c3d4e5f6g7h8i9j0`
2. ID 부분 추출: `a1b2c3d4e5f6g7h8i9j0`
3. 이것이 `NOTION_DATABASE_ID`

#### Google Analytics ID
1. [Google Analytics](https://analytics.google.com/) 접속
2. 측정 ID 확인 (G-XXXXXXXXXX 형식)
3. 이것이 `NEXT_PUBLIC_GA_ID`

## 2. Vercel 배포

### 2.1 Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
npm i -g vercel

# Vercel에 로그인
vercel login

# 프로젝트 배포
vercel
```

### 2.2 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 설정 → Environment Variables
2. 다음 변수 추가:
   - `NOTION_API_KEY` - Notion API 키
   - `NOTION_DATABASE_ID` - Notion 데이터베이스 ID
   - `NEXT_PUBLIC_GA_ID` - Google Analytics ID

### 2.3 자동 배포 설정

GitHub 저장소와 Vercel 연결:
1. Vercel 대시보드 → New Project
2. GitHub 저장소 선택
3. Framework 선택: Next.js
4. Environment Variables 설정
5. Deploy 클릭

## 3. 도메인 연결

### 3.1 커스텀 도메인 설정

Vercel 대시보드에서:
1. Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력
4. DNS 레코드 설정 (도메인 공급자에서):
   - CNAME: `cname.vercel.com`
   - A 레코드: `76.76.19.132`

### 3.2 SSL 인증서

Vercel이 자동으로 Let's Encrypt SSL 인증서 발급

## 4. CI/CD 설정

### 4.1 GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일이 자동으로:
1. PR 생성 시 테스트 실행
2. Main 브랜치에 병합 시 배포

### 4.2 시크릿 설정

GitHub 저장소 Settings → Secrets에 추가:
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `VERCEL_TOKEN` - Vercel API 토큰
- `VERCEL_ORG_ID` - Vercel 조직 ID
- `VERCEL_PROJECT_ID` - Vercel 프로젝트 ID
- `GA_ID` - Google Analytics ID

## 5. 배포 후 확인

### 5.1 기본 확인 항목
- [ ] 홈페이지 접근 가능
- [ ] 포스트 상세 페이지 로드됨
- [ ] 카테고리/태그 필터링 작동
- [ ] 검색 기능 작동
- [ ] 이미지 정상 표시

### 5.2 성능 확인
```bash
# Lighthouse 점수 확인
# https://pagespeed.web.dev/ 접속
# 본인의 도메인 입력
```

성능 목표:
- Lighthouse 성능: 90점 이상
- Lighthouse SEO: 95점 이상
- LCP (Largest Contentful Paint): 2.5초 이내

### 5.3 SEO 확인
- [ ] Google Search Console에 등록
- [ ] Sitemap 제출
- [ ] Robots.txt 확인

## 6. 모니터링

### 6.1 Vercel 분석
- 배포 현황: Vercel 대시보드 → Deployments
- 성능 지표: Analytics 탭
- 에러 로그: Function Logs

### 6.2 Google Analytics
- 접속: [Google Analytics](https://analytics.google.com/)
- 사용자 행동 추적
- 페이지뷰, 이벤트 모니터링

## 7. 유지보수

### 7.1 정기 점검
- **주 1회**: 배포 상태 확인
- **월 1회**: Notion 데이터베이스 정상 작동 확인
- **월 1회**: npm 패키지 업데이트 확인

### 7.2 업데이트 방법

```bash
# 로컬 개발
git checkout develop
git pull origin develop
npm install
npm run dev

# 테스트 및 커밋
git add .
git commit -m "기능 추가: XYZ"

# PR 생성 후 병합
git push origin develop
# GitHub에서 PR 생성
# Main에 병합되면 자동 배포
```

## 8. 트러블슈팅

### 빌드 실패
```bash
# 1. 로컬에서 테스트
npm run build

# 2. 환경 변수 확인
# Vercel 대시보드에서 환경 변수 설정 확인

# 3. 로그 확인
# Vercel Deployments 탭에서 실패한 배포의 로그 확인
```

### Notion 연동 오류
```bash
# 1. API 키 확인
# https://www.notion.com/my-integrations

# 2. 데이터베이스 공유 확인
# Notion에서 데이터베이스 → Share → 인테그레이션 선택

# 3. 데이터베이스 ID 확인
# Notion 데이터베이스 URL에서 ID 추출
```

### 성능 문제
- Vercel Analytics에서 병목 확인
- Lighthouse 보고서 검토
- 이미지 최적화 확인 (Next.js Image 컴포넌트 사용)

## 9. 보안 주의사항

⚠️ **절대 금지:**
- `.env.local` 파일을 GitHub에 커밋하지 마세요
- API 키를 코드에 직접 포함하지 마세요
- 시크릿 정보를 로그에 출력하지 마세요

✅ **권장사항:**
- `.env.example` 파일로 필요한 환경 변수 문서화
- Vercel 시크릿 관리 기능 사용
- 정기적으로 API 키 갱신

## 10. 자동 갱신 설정

Notion 데이터 자동 갱신 (ISR):
- 홈페이지: 1시간마다 재검증
- 포스트 상세: 1시간마다 재검증
- 카테고리/태그: 1시간마다 재검증

필요시 `revalidate` 값 수정 (초 단위):
```typescript
// src/app/page.tsx
export const revalidate = 3600; // 1시간
```

## 추가 리소스

- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 문서](https://vercel.com/docs)
- [Notion API 문서](https://developers.notion.com/)
- [Google Analytics 문서](https://support.google.com/analytics)
