/**
 * 접근성 설정 패널 컴포넌트
 * 글자 크기, 고대비 모드 등을 조절하는 UI를 제공합니다.
 */

'use client';

import { useState } from 'react';
import { useAccessibility } from '@/components/AccessibilityProvider';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';

/**
 * 접근성 설정 패널 컴포넌트
 */
export default function AccessibilityPanel() {
  // 패널 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, highContrast, setFontSize, toggleHighContrast } = useAccessibility();

  return (
    <>
      {/* 접근성 설정 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="접근성 설정"
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* 접근성 설정 패널 */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 rounded-lg border border-border/50 bg-card shadow-lg p-6 space-y-6 z-50"
          role="region"
          aria-label="접근성 설정"
        >
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">접근성 설정</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="패널 닫기"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 글자 크기 설정 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">글자 크기</label>
            <div className="flex gap-2">
              {[
                { value: 100, label: '100%' },
                { value: 125, label: '125%' },
                { value: 150, label: '150%' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={fontSize === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize(option.value)}
                  className="flex-1"
                  aria-pressed={fontSize === option.value}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              글자 크기를 조절하여 가독성을 개선할 수 있습니다.
            </p>
          </div>

          {/* 고대비 모드 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={toggleHighContrast}
                className="h-4 w-4 rounded cursor-pointer"
                aria-label="고대비 모드"
              />
              고대비 모드
            </label>
            <p className="text-xs text-muted-foreground">
              색상 대비를 높여서 텍스트를 더 선명하게 읽을 수 있습니다.
            </p>
          </div>

          {/* 인쇄 옵션 */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.print();
                setIsOpen(false);
              }}
              aria-label="현재 페이지 인쇄"
            >
              인쇄하기
            </Button>
            <p className="text-xs text-muted-foreground">
              페이지를 최적화된 인쇄 레이아웃으로 출력할 수 있습니다.
            </p>
          </div>

          {/* 설정 초기화 */}
          <div className="pt-4 border-t border-border/50">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setFontSize(100);
                if (highContrast) {
                  toggleHighContrast();
                }
                setIsOpen(false);
              }}
              aria-label="설정 초기화"
            >
              설정 초기화
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
