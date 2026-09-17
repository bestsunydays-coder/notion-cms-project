/**
 * 포스트 상세 페이지
 * 개별 포스트의 전체 내용을 표시하는 페이지입니다.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotionBlocks } from '@/components/NotionBlock';
import { Badge } from '@/components/ui/badge';
import TagBadge from '@/components/TagBadge';
import PostCard from '@/components/PostCard';
import { getPosts, getPostById } from '@/lib/notion';
import { formatDateLong } from '@/lib/utils/date';
import { filterPublished, sortPosts } from '@/lib/utils/filter';
import { ArrowLeft, Calendar, User } from 'lucide-react';

// ISR 캐싱 (1시간마다 재검증)
export const revalidate = 3600;

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * 정적 페이지 생성을 위한 모든 포스트 경로 미리 생성
 */
export async function generateStaticParams() {
  // 모든 포스트 조회
  const postsResponse = await getPosts();

  if (!postsResponse.success || !postsResponse.data) {
    return [];
  }

  // 발행된 포스트만 필터링
  const publishedPosts = filterPublished(postsResponse.data);

  // 포스트 ID를 slug로 사용
  return publishedPosts.map((post) => ({
    slug: post.id,
  }));
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
      description: '요청하신 포스트를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${post.title} | Notion 여행 가이드 블로그`,
    description: post.excerpt || '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
    openGraph: {
      title: post.title,
      description: post.excerpt || '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
      type: 'article',
      url: `https://notion-cms.example.com/posts/${post.id}`,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      publishedTime: post.publishedDate?.toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

/**
 * 관련 포스트를 표시하는 컴포넌트
 */
async function RelatedPosts({ category, currentPostId }: { category: string; currentPostId: string }) {
  // 같은 카테고리의 포스트 조회
  const postsResponse = await getPosts();

  if (!postsResponse.success || !postsResponse.data) {
    return null;
  }

  // 발행된 포스트 중 같은 카테고리이고 현재 포스트가 아닌 것만 필터링
  let related = filterPublished(postsResponse.data)
    .filter((post) => post.category === category && post.id !== currentPostId)
    .slice(0, 3);

  // 최신 순으로 정렬
  related = sortPosts(related, 'date-desc');

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        관련 포스트
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

/**
 * 이전/다음 포스트 네비게이션
 */
async function PostNavigation({
  currentCategory,
  currentPostId,
}: {
  currentCategory: string;
  currentPostId: string;
}) {
  // 같은 카테고리의 모든 포스트 조회
  const postsResponse = await getPosts();

  if (!postsResponse.success || !postsResponse.data) {
    return null;
  }

  // 발행된 포스트 중 같은 카테고리인 것만 필터링
  let posts = filterPublished(postsResponse.data).filter((post) => post.category === currentCategory);

  // 최신 순으로 정렬
  posts = sortPosts(posts, 'date-desc');

  // 현재 포스트의 인덱스 찾기
  const currentIndex = posts.findIndex((post) => post.id === currentPostId);

  if (currentIndex === -1) {
    return null;
  }

  // 이전/다음 포스트 찾기
  const previousPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-4 flex-col md:flex-row">
      {previousPost ? (
        <Link
          href={`/posts/${previousPost.id}`}
          className="flex-1 group text-left hover:opacity-80 transition-opacity"
        >
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 group-hover:text-primary">
            ← 이전 포스트
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {previousPost.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Link
          href={`/posts/${nextPost.id}`}
          className="flex-1 group text-right hover:opacity-80 transition-opacity"
        >
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 group-hover:text-primary">
            다음 포스트 →
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {nextPost.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostById(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm flex justify-center w-full">
          <nav className="max-w-6xl w-full px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-lg hover:opacity-80 transition-opacity">
              Notion 여행 가이드
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Link>

          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">포스트를 찾을 수 없습니다.</p>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = post.publishedDate ? formatDateLong(post.publishedDate) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm flex justify-center w-full">
        <nav className="max-w-6xl w-full px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-lg hover:opacity-80 transition-opacity">
            Notion 여행 가이드
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Link>

        {/* 포스트 헤더 */}
        <article className="mb-12">
          {/* 썸네일 */}
          {post.thumbnail && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 제목 및 메타데이터 */}
          <header className="mb-8 space-y-4">
            {/* 카테고리 */}
            <div>
              <Link href={`/?category=${encodeURIComponent(post.category)}`}>
                <Badge variant="secondary" className="hover:opacity-80 cursor-pointer">
                  {post.category}
                </Badge>
              </Link>
            </div>

            {/* 제목 */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">
              {post.title}
            </h1>

            {/* 메타정보 (발행일, 작성자) */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              {post.publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedDate.toISOString()}>
                    {formattedDate}
                  </time>
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </header>

          {/* 포스트 콘텐츠 */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            {post.content && post.content.length > 0 ? (
              <NotionBlocks blocks={post.content} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                포스트 콘텐츠를 로드할 수 없습니다.
              </p>
            )}
          </div>

          {/* 이전/다음 포스트 네비게이션 */}
          <Suspense fallback={null}>
            <PostNavigation currentCategory={post.category} currentPostId={post.id} />
          </Suspense>
        </article>

        {/* 관련 포스트 */}
        <Suspense fallback={null}>
          <RelatedPosts category={post.category} currentPostId={post.id} />
        </Suspense>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border/50 mt-20 py-8 flex justify-center w-full">
        <div className="max-w-6xl w-full px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Notion 여행 가이드 블로그. Powered by Next.js & Notion API</p>
        </div>
      </footer>
    </div>
  );
}
