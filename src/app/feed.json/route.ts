/**
 * JSON Feed 제공
 * 최근 포스트의 JSON Feed를 제공하는 API 라우트입니다.
 */

import { getPosts } from '@/lib/notion';
import { filterPublished, sortPosts } from '@/lib/utils/filter';

/**
 * JSON Feed 생성
 */
export async function GET() {
  try {
    // 포스트 조회
    const postsResponse = await getPosts();

    if (!postsResponse.success || !postsResponse.data) {
      throw new Error('포스트를 조회할 수 없습니다');
    }

    // 발행된 포스트만 필터링하고 최신순 정렬
    let posts = filterPublished(postsResponse.data);
    posts = sortPosts(posts, 'date-desc');

    // 최근 20개만 선택
    const feedPosts = posts.slice(0, 20);

    // JSON Feed 생성
    const baseUrl = 'https://notion-cms.example.com';

    const items = feedPosts.map((post) => ({
      id: `${baseUrl}/posts/${post.id}`,
      url: `${baseUrl}/posts/${post.id}`,
      title: post.title,
      content_html: post.excerpt || '포스트 내용',
      date_published: post.publishedDate ? post.publishedDate.toISOString() : new Date().toISOString(),
      authors: post.author ? [{ name: post.author }] : undefined,
      tags: [...new Set([post.category, ...post.tags])],
      image: post.thumbnail || undefined,
    }));

    const feed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Notion 여행 가이드 블로그',
      description: '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/feed.json`,
      language: 'ko-KR',
      items,
    };

    return new Response(JSON.stringify(feed, null, 2), {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('JSON Feed 생성 오류:', error);

    const errorFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: '오류',
      description: 'JSON Feed를 생성할 수 없습니다.',
      items: [],
    };

    return new Response(JSON.stringify(errorFeed), {
      status: 500,
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
      },
    });
  }
}
