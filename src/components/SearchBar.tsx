/**
 * 검색 바 컴포넌트
 * 사용자가 포스트를 검색할 수 있는 입력 필드를 제공합니다.
 * 검색 결과는 /search 페이지로 이동합니다.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  // 초기 검색어 (선택사항)
  initialQuery?: string;
  // 검색 시 동작할 콜백 함수 (선택사항)
  onSearch?: (query: string) => void;
}

export default function SearchBar({ initialQuery = '', onSearch }: SearchBarProps) {
  // 검색어 상태
  const [query, setQuery] = useState(initialQuery);
  // 라우터
  const router = useRouter();

  /**
   * 검색 처리
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 검색어가 비어있으면 반환
    if (!query.trim()) {
      return;
    }

    // 콜백 함수 호출
    if (onSearch) {
      onSearch(query);
    }

    // 검색 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  /**
   * 검색어 입력 처리
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  /**
   * 검색어 초기화
   */
  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        {/* 검색 입력 필드 */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="포스트 검색..."
            value={query}
            onChange={handleInputChange}
            className="w-full pr-10 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          {/* 검색어가 있을 때 초기화 버튼 표시 */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="검색어 초기화"
            >
              ✕
            </button>
          )}
        </div>

        {/* 검색 버튼 */}
        <Button
          type="submit"
          disabled={!query.trim()}
          className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">검색</span>
        </Button>
      </div>
    </form>
  );
}
