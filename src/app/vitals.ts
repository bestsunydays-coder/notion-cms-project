/**
 * Web Vitals 측정 및 분석 전송
 * 페이지 성능 지표를 Google Analytics로 전송합니다.
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

/**
 * Web Vitals 메트릭을 Google Analytics로 전송
 */
export function reportWebVitals(metric: any) {
  // Google Analytics가 준비될 때까지 대기
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const { name, value, rating, delta, id } = metric;

    // 메트릭을 이벤트로 전송
    (window as any).gtag('event', name, {
      value: Math.round(value),
      event_category: 'web_vitals',
      event_label: id,
      rating: rating,
      metric_delta: Math.round(delta || 0),
      metric_value: Math.round(value),
    });

    // 좋지 않은 평가일 경우 콘솔에 경고
    if (rating === 'poor') {
      console.warn(`⚠️ ${name}: ${Math.round(value)}ms (Poor)`);
    }
  }
}

/**
 * 모든 Web Vitals 메트릭 수집
 */
export function collectWebVitals() {
  // 페이지 로드 완료 후 메트릭 수집
  if (typeof window !== 'undefined') {
    // Cumulative Layout Shift (CLS)
    onCLS(reportWebVitals);

    // Interaction to Next Paint (INP)
    try {
      onINP(reportWebVitals);
    } catch (e) {
      // INP 지원하지 않는 브라우저는 무시
    }

    // First Contentful Paint (FCP)
    onFCP(reportWebVitals);

    // Largest Contentful Paint (LCP)
    onLCP(reportWebVitals);

    // Time to First Byte (TTFB)
    onTTFB(reportWebVitals);
  }
}
