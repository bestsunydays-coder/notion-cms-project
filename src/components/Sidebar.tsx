/**
 * 사이드바 컴포넌트
 * 다양한 위젯들을 포함하는 사이드바 컨테이너입니다.
 * 반응형 디자인: 모바일에서는 숨김, 태블릿/데스크톱에서 표시
 */

import { Suspense } from 'react';
import PopularCategories, {
  PopularCategoriesSkeleton,
} from '@/components/widgets/PopularCategories';
import RecentPosts, { RecentPostsSkeleton } from '@/components/widgets/RecentPosts';
import TagCloud, { TagCloudSkeleton } from '@/components/widgets/TagCloud';
import NewsletterWidget from '@/components/widgets/Newsletter';

/**
 * 사이드바 컴포넌트
 * 탭레릿(md) 이상의 화면에서 표시되고, 모바일에서는 숨겨집니다.
 */
export default function Sidebar() {
  return (
    <aside className="hidden md:block md:w-80 lg:w-96 flex-shrink-0 space-y-6">
      {/* 인기 카테고리 위젯 */}
      <Suspense fallback={<PopularCategoriesSkeleton />}>
        <PopularCategories />
      </Suspense>

      {/* 최근 글 위젯 */}
      <Suspense fallback={<RecentPostsSkeleton />}>
        <RecentPosts />
      </Suspense>

      {/* 뉴스레터 위젯 */}
      <NewsletterWidget />

      {/* 태그 클라우드 위젯 */}
      <Suspense fallback={<TagCloudSkeleton />}>
        <TagCloud />
      </Suspense>
    </aside>
  );
}
