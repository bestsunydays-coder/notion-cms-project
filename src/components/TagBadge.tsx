/**
 * 태그 배지 컴포넌트
 * 포스트의 태그를 작은 배지로 표시합니다.
 * 태그 클릭 시 해당 태그로 필터링된 포스트 목록으로 이동합니다.
 */

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  // 태그 이름
  tag: string;
  // 클릭 시 동작 (선택사항)
  onClick?: () => void;
}

export default function TagBadge({ tag, onClick }: TagBadgeProps) {
  // 태그 색상 배열 (순환)
  const colors = [
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  ];

  // 태그에 일관된 색상 할당
  const colorIndex = tag.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={`/search?tag=${encodeURIComponent(tag)}`}>
      <Badge
        variant="outline"
        className={`cursor-pointer transition-opacity hover:opacity-80 ${colorClass}`}
        onClick={handleClick}
      >
        #{tag}
      </Badge>
    </Link>
  );
}
