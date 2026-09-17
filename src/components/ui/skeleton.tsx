/**
 * 스켈레톤 로더 컴포넌트
 * 콘텐츠 로딩 중 플레이스홀더를 표시합니다.
 */

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
