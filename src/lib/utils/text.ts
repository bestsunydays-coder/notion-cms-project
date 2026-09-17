/**
 * 텍스트 처리 유틸리티
 * 텍스트 요약, 자르기, 정제 등의 기능을 제공합니다.
 */

/**
 * 텍스트를 지정된 길이로 요약
 * @param text 원본 텍스트
 * @param maxLength 최대 길이 (기본값: 150)
 * @param suffix 끝에 붙일 문자 (기본값: "...")
 * @returns 요약된 텍스트
 */
export function truncateText(
  text: string,
  maxLength: number = 150,
  suffix: string = '...',
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // 마지막 공백 위치 찾기 (더 자연스러운 자르기)
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + suffix;
  }

  return truncated + suffix;
}

/**
 * HTML 태그 제거
 * @param html HTML 문자열
 * @returns 태그가 제거된 순수 텍스트
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 마크다운 문법 제거
 * @param markdown 마크다운 문자열
 * @returns 마크다운 문법이 제거된 텍스트
 */
export function stripMarkdown(markdown: string): string {
  return (
    markdown
      // 헤더 제거 (# ## ### 등)
      .replace(/^#{1,6}\s+/gm, '')
      // 볼드 제거 (**text** 또는 __text__)
      .replace(/\*\*|__/g, '')
      // 이탤릭 제거 (*text* 또는 _text_)
      .replace(/\*|_/g, '')
      // 코드 블록 제거 (```code```)
      .replace(/```[\s\S]*?```/g, '')
      // 인라인 코드 제거 (`code`)
      .replace(/`[^`]*`/g, '')
      // 링크 제거 ([text](url))
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // 리스트 항목 제거 (- * +)
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // 인용 제거 (> text)
      .replace(/^>\s+/gm, '')
  );
}

/**
 * 텍스트의 단어 개수 반환
 * @param text 텍스트
 * @returns 단어 개수
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * 텍스트의 문자 개수 반환 (공백 포함)
 * @param text 텍스트
 * @returns 문자 개수
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * 텍스트의 문자 개수 반환 (공백 제외)
 * @param text 텍스트
 * @returns 문자 개수 (공백 제외)
 */
export function countCharactersWithoutSpaces(text: string): string {
  return text.replace(/\s/g, '').length.toString();
}

/**
 * 문자열의 각 단어 첫 글자를 대문자로 변환
 * @param text 텍스트
 * @returns 각 단어의 첫 글자가 대문자인 텍스트
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * 첫 글자만 대문자로 변환
 * @param text 텍스트
 * @returns 첫 글자가 대문자인 텍스트
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 텍스트 좌우 공백 제거
 * @param text 텍스트
 * @returns 공백이 제거된 텍스트
 */
export function trim(text: string): string {
  return text.trim();
}

/**
 * 연속된 공백을 단일 공백으로 변환
 * @param text 텍스트
 * @returns 정제된 텍스트
 */
export function normalizeSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * 텍스트가 특정 문자열로 시작하는지 확인
 * @param text 텍스트
 * @param prefix 접두사
 * @param caseSensitive 대소문자 구분 (기본값: true)
 * @returns 시작하면 true
 */
export function startsWith(
  text: string,
  prefix: string,
  caseSensitive: boolean = true,
): boolean {
  if (caseSensitive) {
    return text.startsWith(prefix);
  }
  return text.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * 텍스트가 특정 문자열로 끝나는지 확인
 * @param text 텍스트
 * @param suffix 접미사
 * @param caseSensitive 대소문자 구분 (기본값: true)
 * @returns 끝나면 true
 */
export function endsWith(
  text: string,
  suffix: string,
  caseSensitive: boolean = true,
): boolean {
  if (caseSensitive) {
    return text.endsWith(suffix);
  }
  return text.toLowerCase().endsWith(suffix.toLowerCase());
}

/**
 * 검색어가 포함된 텍스트 강조 (HTML 마크업)
 * @param text 원본 텍스트
 * @param searchTerm 검색어
 * @returns 강조된 HTML 문자열
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
