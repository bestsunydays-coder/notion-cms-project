/**
 * 날짜 포맷팅 유틸리티
 * 날짜를 다양한 형식으로 변환합니다.
 */

/**
 * 날짜를 "YYYY-MM-DD" 형식으로 포맷팅
 * @param date 날짜 객체
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷팅
 * @param date 날짜 객체
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 날짜를 "MM월 DD일" 형식으로 포맷팅
 * @param date 날짜 객체
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDateMonthDay(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * 상대적 시간 표현 반환 (예: "2일 전", "1시간 전")
 * @param date 날짜 객체
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  // 1분 이내
  if (diffSec < 60) {
    return '방금 전';
  }

  // 1시간 이내
  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }

  // 1일 이내
  if (diffHour < 24) {
    return `${diffHour}시간 전`;
  }

  // 1주 이내
  if (diffDay < 7) {
    return `${diffDay}일 전`;
  }

  // 1달 이내
  if (diffWeek < 4) {
    return `${diffWeek}주 전`;
  }

  // 1년 이내
  if (diffMonth < 12) {
    return `${diffMonth}개월 전`;
  }

  // 1년 이상
  return `${diffYear}년 전`;
}

/**
 * 두 날짜 사이의 일수 계산
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 일수
 */
export function calculateDaysBetween(date1: Date, date2: Date): number {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * 날짜가 오늘인지 확인
 * @param date 날짜 객체
 * @returns 오늘이면 true
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 날짜가 어제인지 확인
 * @param date 날짜 객체
 * @returns 어제이면 true
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}
