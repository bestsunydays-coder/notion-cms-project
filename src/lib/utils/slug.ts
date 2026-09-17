/**
 * 슬러그 생성 유틸리티
 * 문자열을 URL에 사용 가능한 슬러그 형식으로 변환합니다.
 */

/**
 * 텍스트를 슬러그로 변환
 * 한글, 영문, 숫자만 포함하고 하이픈으로 연결합니다.
 * @param text 변환할 텍스트
 * @returns 슬러그 형식의 문자열
 */
export function generateSlug(text: string): string {
  return text
    // 소문자로 변환
    .toLowerCase()
    // 특수문자 제거 (공백, 한글, 영문, 숫자만 유지)
    .replace(/[^\w\s가-힣]/g, '')
    // 공백을 하이픈으로 변환
    .replace(/\s+/g, '-')
    // 연속된 하이픈을 단일 하이픈으로 변환
    .replace(/-+/g, '-')
    // 앞뒤 하이픈 제거
    .trim()
    .replace(/^-|-$/g, '');
}

/**
 * Notion 페이지 ID를 슬러그로 변환
 * UUID 형식의 ID를 짧은 슬러그로 변환합니다.
 * @param notionId Notion 페이지 ID
 * @returns 슬러그 형식의 ID
 */
export function notionIdToSlug(notionId: string): string {
  // 하이픈 제거
  const cleaned = notionId.replace(/-/g, '');
  // 처음 12자리만 사용
  return cleaned.substring(0, 12).toLowerCase();
}

/**
 * 제목과 날짜로부터 슬러그 생성
 * @param title 포스트 제목
 * @param date 발행 날짜
 * @returns 슬러그 형식의 문자열 (예: "2024-01-15-hello-world")
 */
export function generateSlugWithDate(title: string, date: Date): string {
  // 날짜 부분
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  // 제목 슬러그 부분
  const titleSlug = generateSlug(title);
  // 결합
  return `${dateStr}-${titleSlug}`;
}

/**
 * URL 인코딩된 슬러그를 디코딩
 * @param slug 슬러그
 * @returns 디코딩된 문자열
 */
export function decodeSlug(slug: string): string {
  return decodeURIComponent(slug);
}

/**
 * 슬러그에서 날짜 정보 추출
 * "YYYY-MM-DD-title" 형식에서 날짜만 추출합니다.
 * @param slug 슬러그
 * @returns 날짜 객체 또는 null
 */
export function extractDateFromSlug(slug: string): Date | null {
  // YYYY-MM-DD 패턴 매칭
  const dateMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return null;

  const [, year, month, day] = dateMatch;
  try {
    return new Date(`${year}-${month}-${day}`);
  } catch {
    return null;
  }
}

/**
 * 슬러그에서 제목 부분 추출
 * "YYYY-MM-DD-title" 형식에서 제목 부분만 추출합니다.
 * @param slug 슬러그
 * @returns 제목 부분의 슬러그
 */
export function extractTitleFromSlug(slug: string): string {
  // 처음 10자리 (YYYY-MM-DD) 제거
  return slug.substring(11) || slug;
}
