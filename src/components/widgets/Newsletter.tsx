/**
 * 뉴스레터 구독 위젯
 * 사용자가 이메일을 등록해서 새 포스트를 구독할 수 있는 위젯입니다.
 */

'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

/**
 * 뉴스레터 위젯
 */
export default function NewsletterWidget() {
  // 폼 상태 관리
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  /**
   * 폼 제출 핸들러
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // 입력 검증
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage({
          type: 'error',
          text: '유효한 이메일을 입력해주세요.',
        });
        return;
      }

      // 실제 구현에서는 백엔드 API로 전송
      // 현재는 로컬에서만 처리 (나중에 확장)
      console.log('구독 신청:', email);

      // 성공 메시지 표시
      setMessage({
        type: 'success',
        text: '구독해주셔서 감사합니다!',
      });

      // 폼 초기화
      setEmail('');

      // 2초 후 메시지 자동 제거
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error('구독 오류:', error);
      setMessage({
        type: 'error',
        text: '구독 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">
          뉴스레터
        </h3>
      </div>

      {/* 설명 */}
      <p className="text-sm text-muted-foreground mb-4">
        새 포스트가 발행되면 이메일로 알려드립니다.
      </p>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-background/50"
        />
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full"
        >
          {isLoading ? '처리 중...' : '구독하기'}
        </Button>
      </form>

      {/* 메시지 */}
      {message && (
        <div
          className={`mt-3 p-3 rounded text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
