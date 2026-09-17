/**
 * 카테고리별 RSS 피드 제공
 * 특정 카테고리의 RSS 피드를 제공하는 API 라우트입니다.
 */

import { getPosts } from '@/lib/notion';
import { filterPublished, filterByCategory, sortPosts } from '@/lib/utils/filter';

/**
 * 카테고리별 RSS 피드 생성
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    // 포스트 조회
    const postsResponse = await getPosts();

    if (!postsResponse.success || !postsResponse.data) {
      throw new Error('포스트를 조회할 수 없습니다');
    }

    // 해당 카테고리의 발행된 포스트만 필터링하고 최신순 정렬
    let posts = filterPublished(postsResponse.data);
    posts = filterByCategory(posts, decodedCategory);
    posts = sortPosts(posts, 'date-desc');

    // 최근 20개만 선택
    const feedPosts = posts.slice(0, 20);

    // RSS 피드 생성
    const baseUrl = 'https://notion-cms.example.com';
    const lastBuildDate = new Date().toUTCString();
    const feedUrl = `${baseUrl}/categories/${category}/feed.xml`;

    const rssItems = feedPosts
      .map((post) => {
        const pubDate = post.publishedDate ? new Date(post.publishedDate).toUTCString() : lastBuildDate;
        const content = post.excerpt || '포스트 내용';

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/posts/${post.id}</link>
      <guid isPermaLink="false">${baseUrl}/posts/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(content)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ''}
    </item>`;
      })
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(decodedCategory)} - Notion 여행 가이드 블로그</title>
    <link>${baseUrl}/categories/${category}</link>
    <description>${escapeXml(decodedCategory)} 카테고리의 여행 가이드와 팁을 공유하는 블로그입니다.</description>
    <language>ko-kr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js & Notion API</generator>
${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('카테고리 RSS 피드 생성 오류:', error);

    const errorRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>오류</title>
    <link>https://notion-cms.example.com</link>
    <description>RSS 피드를 생성할 수 없습니다.</description>
  </channel>
</rss>`;

    return new Response(errorRss, {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  }
}

/**
 * XML 특수 문자 이스케이프
 * @param text 입력 텍스트
 * @returns 이스케이프된 텍스트
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
