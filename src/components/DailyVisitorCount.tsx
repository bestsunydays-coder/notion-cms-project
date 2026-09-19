'use client';

import { useState, useEffect } from 'react';

interface VisitorData {
  date: string;
  count: number;
}

export default function DailyVisitorCount() {
  const [visitors, setVisitors] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateVisitor = async () => {
      try {
        // 로컬 스토리지에서 마지막 방문 날짜 확인
        const today = new Date().toISOString().split('T')[0];
        const lastVisitDate = localStorage.getItem('lastVisitDate');

        // 오늘이 처음 방문이면 방문자 수 증가
        if (lastVisitDate !== today) {
          localStorage.setItem('lastVisitDate', today);
          await fetch('/api/visitors', { method: 'POST' });
        }

        // 현재 방문자 수 조회
        const response = await fetch('/api/visitors');
        if (response.ok) {
          const data = await response.json();
          setVisitors(data);
        }
      } catch (error) {
        console.error('방문자 수 업데이트 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    updateVisitor();
  }, []);

  if (loading || !visitors) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
      </svg>
      오늘 방문자: <span className="font-bold">{visitors.count.toLocaleString()}</span>명
    </div>
  );
}
