'use client';

/**
 * Google Analytics 4 추적 컴포넌트
 * 페이지 조회, 클릭 이벤트, 사용자 행동을 추적합니다.
 * Web Vitals 메트릭도 함께 수집합니다.
 */

import { useEffect } from 'react';
import Script from 'next/script';
import { collectWebVitals } from '@/app/vitals';

interface GoogleAnalyticsProps {
  // Google Analytics 측정 ID (GA4 ID)
  gaId: string;
}

/**
 * Google Analytics 추적 스크립트
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  // Web Vitals 수집
  useEffect(() => {
    collectWebVitals();
  }, []);

  // 측정 ID가 없으면 렌더링하지 않음
  if (!gaId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 글로벌 사이트 태그 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Analytics 초기화 및 이벤트 추적 설정 */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
            });

            // 링크 클릭 추적
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a[href]');
              if (link && link.href) {
                gtag('event', 'click', {
                  'event_category': 'engagement',
                  'event_label': link.href,
                  'value': 1
                });
              }
            });

            // 검색 이벤트 추적
            window.trackSearch = function(searchQuery, resultCount) {
              gtag('event', 'search', {
                search_term: searchQuery,
                number_of_results: resultCount
              });
            };

            // 공유 이벤트 추적
            window.trackShare = function(method, contentId) {
              gtag('event', 'share', {
                method: method,
                content_id: contentId
              });
            };

            // 구독 이벤트 추적
            window.trackSubscribe = function(method) {
              gtag('event', 'subscribe', {
                method: method
              });
            };
          `,
        }}
      />
    </>
  );
}
