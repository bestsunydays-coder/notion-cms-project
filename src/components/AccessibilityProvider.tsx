/**
 * 접근성 제공자 컴포넌트
 * 글자 크기, 고대비 모드 등 접근성 설정을 관리하는 컴포넌트입니다.
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * 접근성 컨텍스트 타입
 */
interface AccessibilityContextType {
  // 글자 크기 (100, 125, 150)
  fontSize: number;
  // 고대비 모드
  highContrast: boolean;
  // 글자 크기 변경
  setFontSize: (size: number) => void;
  // 고대비 모드 토글
  toggleHighContrast: () => void;
}

/**
 * 접근성 컨텍스트
 */
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * 접근성 제공자 컴포넌트
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState(100);
  const [highContrast, setHighContrastState] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 설정 로드
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('a11y-font-size');
      const savedHighContrast = localStorage.getItem('a11y-high-contrast');

      if (savedFontSize) {
        setFontSizeState(parseInt(savedFontSize, 10));
      }

      if (savedHighContrast === 'true') {
        setHighContrastState(true);
      }
    } catch (error) {
      console.error('접근성 설정 로드 오류:', error);
    }

    setMounted(true);
  }, []);

  // 글자 크기 변경
  const setFontSize = (size: number) => {
    // 유효한 값만 허용 (100, 125, 150)
    if (![100, 125, 150].includes(size)) {
      return;
    }

    setFontSizeState(size);

    try {
      localStorage.setItem('a11y-font-size', size.toString());
      // DOM 업데이트
      if (size === 100) {
        document.documentElement.removeAttribute('data-font-size');
      } else {
        document.documentElement.setAttribute('data-font-size', size.toString());
      }
    } catch (error) {
      console.error('글자 크기 저장 오류:', error);
    }
  };

  // 고대비 모드 토글
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrastState(newValue);

    try {
      localStorage.setItem('a11y-high-contrast', newValue.toString());
      // DOM 업데이트
      if (newValue) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
      } else {
        document.documentElement.removeAttribute('data-high-contrast');
      }
    } catch (error) {
      console.error('고대비 모드 저장 오류:', error);
    }
  };

  // 마운트될 때까지 렌더링 지연 (hydration 오류 방지)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        setFontSize,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * 접근성 컨텍스트 훅
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (context === undefined) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }

  return context;
}
