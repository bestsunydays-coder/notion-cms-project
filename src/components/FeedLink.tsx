/**
 * 피드 링크 컴포넌트
 * RSS/JSON 피드 링크를 제공하는 컴포넌트입니다.
 */

import Link from 'next/link';
import { Rss } from 'lucide-react';

interface FeedLinkProps {
  // 카테고리명 (선택사항)
  category?: string;
}

/**
 * 피드 링크 컴포넌트
 */
export default function FeedLink({ category }: FeedLinkProps) {
  const feedUrl = category
    ? `/categories/${encodeURIComponent(category)}/feed.xml`
    : '/feed.xml';

  const jsonFeedUrl = category ? undefined : '/feed.json';

  return (
    <div className="flex items-center gap-2">
      {/* RSS 피드 링크 */}
      <Link
        href={feedUrl}
        className="inline-flex items-center gap-1 px-3 py-2 rounded hover:bg-accent transition-colors"
        title="RSS 피드 구독"
        aria-label="RSS 피드"
      >
        <Rss className="h-4 w-4" />
        <span className="text-sm font-medium">RSS</span>
      </Link>

      {/* JSON Feed 링크 (전체 피드만) */}
      {jsonFeedUrl && (
        <Link
          href={jsonFeedUrl}
          className="inline-flex items-center gap-1 px-3 py-2 rounded hover:bg-accent transition-colors text-sm"
          title="JSON Feed 구독"
          aria-label="JSON Feed"
        >
          JSON Feed
        </Link>
      )}
    </div>
  );
}
