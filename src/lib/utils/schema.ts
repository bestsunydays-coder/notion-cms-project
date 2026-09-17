/**
 * 구조화된 데이터 생성 유틸리티
 * JSON-LD 형식의 스키마를 생성하여 검색 엔진 최적화를 돕습니다.
 */

import type { Post, Category } from '@/lib/types';

/**
 * 조직 스키마 생성
 * @returns 조직 JSON-LD 스키마
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Notion 여행 가이드 블로그',
    url: 'https://notion-cms.example.com',
    logo: 'https://notion-cms.example.com/logo.png',
    description: '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
    sameAs: [
      // 소셜 미디어 링크
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@notion-cms.example.com',
    },
  };
}

/**
 * 기사 스키마 생성
 * @param post 포스트 데이터
 * @returns 기사 JSON-LD 스키마
 */
export function generateArticleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.thumbnail || 'https://notion-cms.example.com/default-image.png',
    datePublished: post.publishedDate?.toISOString(),
    dateModified: post.publishedDate?.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'Notion 여행 가이드',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Notion 여행 가이드 블로그',
      logo: {
        '@type': 'ImageObject',
        url: 'https://notion-cms.example.com/logo.png',
      },
    },
    url: `https://notion-cms.example.com/posts/${post.id}`,
    articleSection: post.category,
    keywords: post.tags.join(', '),
  };
}

/**
 * 이동 경로 스키마 생성
 * @param breadcrumbs 이동 경로 배열
 * @returns 이동 경로 JSON-LD 스키마
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

/**
 * 컬렉션 페이지 스키마 생성
 * @param title 페이지 제목
 * @param description 페이지 설명
 * @param url 페이지 URL
 * @param items 컬렉션 항목들
 * @returns 컬렉션 페이지 JSON-LD 스키마
 */
export function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  items: Array<{
    name: string;
    url: string;
    image?: string;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.name,
        image: item.image,
      })),
    },
  };
}

/**
 * 웹사이트 스키마 생성
 * @returns 웹사이트 JSON-LD 스키마
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Notion 여행 가이드 블로그',
    url: 'https://notion-cms.example.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://notion-cms.example.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
