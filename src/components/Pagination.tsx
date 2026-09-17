/**
 * 페이지네이션 컴포넌트
 * 이전/다음 버튼과 페이지 번호를 표시합니다.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  // 현재 페이지
  currentPage: number;
  // 전체 페이지 수
  totalPages: number;
  // 각 페이지로 이동할 URL 생성 함수
  getPageUrl: (page: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  getPageUrl,
}: PaginationProps) {
  // 표시할 페이지 번호 목록 (최대 5개)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 끝 페이지가 전체 페이지보다 작으면 시작 페이지 조정
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // 첫 페이지가 1보다 크면 "1"과 "..." 추가
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // 페이지 번호 추가
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 마지막 페이지가 전체 페이지보다 작으면 "..."과 마지막 페이지 추가
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 이전 버튼 */}
      <Link href={getPageUrl(currentPage - 1)} className="no-underline">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          이전
        </Button>
      </Link>

      {/* 페이지 번호 */}
      <div className="flex gap-1">
        {pages.map((page, index) => {
          // "..." 처리
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-600 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className="no-underline"
            >
              <Button
                variant={isCurrentPage ? 'default' : 'outline'}
                size="sm"
                className="min-w-10"
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* 다음 버튼 */}
      <Link href={getPageUrl(currentPage + 1)} className="no-underline">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
