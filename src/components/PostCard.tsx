/**
 * 포스트 카드 컴포넌트
 * 포스트의 요약 정보를 카드 형식으로 표시합니다.
 * 썸네일, 제목, 카테고리, 발행일, 요약이 포함됩니다.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TagBadge from './TagBadge';

interface PostCardProps {
  // 포스트 데이터
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // 발행일 포맷팅 (YYYY-MM-DD)
  const formattedDate = post.publishedDate
    ? post.publishedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '날짜 미정';

  // 요약 텍스트 (최대 150자)
  const excerpt = post.excerpt || '포스트 설명이 없습니다.';
  const truncatedExcerpt =
    excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt;

  return (
    <Link href={`/posts/${post.id}`} className="block transition-transform hover:scale-105">
      <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* 썸네일 이미지 */}
        {post.thumbnail && (
          <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
        )}

        <CardHeader className="pb-3">
          {/* 카테고리 뱃지 */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {post.category}
            </Badge>
            {post.views && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                조회수: {post.views}
              </span>
            )}
          </div>

          {/* 포스트 제목 */}
          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-gray-50">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 포스트 요약 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {truncatedExcerpt}
          </p>

          {/* 태그 표시 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 포스트 정보 (발행일 및 작성자) */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </time>
            {post.author && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {post.author}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
