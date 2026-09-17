/**
 * 동적 사이트맵 생성
 * 모든 포스트와 카테고리 페이지를 포함하는 사이트맵을 생성합니다.
 */

import type { MetadataRoute } from 'next';
import { getPosts, getCategories } from '@/lib/notion';
import { filterPublished } from '@/lib/utils/filter';

/**
 * 사이트맵 생성 함수
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://notion-cms.example.com';

  // 기본 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: new Date(),
    },
  ];

  try {
    // 포스트 페이지
    const postsResponse = await getPosts();
    const postPages: MetadataRoute.Sitemap = [];

    if (postsResponse.success && postsResponse.data) {
      const publishedPosts = filterPublished(postsResponse.data);

      publishedPosts.forEach((post) => {
        postPages.push({
          url: `${baseUrl}/posts/${post.id}`,
          lastModified: post.publishedDate || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    // 카테고리 페이지
    const categories = await getCategories();
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/categories/${encodeURIComponent(category.name)}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
      lastModified: new Date(),
    }));

    // 모든 페이지 결합
    return [...staticPages, ...postPages, ...categoryPages];
  } catch (error) {
    console.error('사이트맵 생성 중 오류:', error);
    return staticPages;
  }
}
