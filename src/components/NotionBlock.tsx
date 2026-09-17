/**
 * Notion 블록 렌더러 컴포넌트
 * Notion의 다양한 블록 타입을 React 컴포넌트로 렌더링합니다.
 * XSS 방지 처리가 포함되어 있습니다.
 */

import React from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import type { NotionBlock } from '@/lib/types';

interface NotionBlockProps {
  // Notion 블록 데이터
  block: NotionBlock;
}

/**
 * Notion 블록 렌더러
 * 블록 타입에 따라 적절한 컴포넌트를 렌더링합니다.
 */
export default function NotionBlock({ block }: NotionBlockProps) {
  // XSS 방지를 위한 HTML 정제
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'mark', 'code'],
      ALLOWED_ATTR: []
    });
  };

  // 블록 타입별 렌더링
  switch (block.type) {
    // 단락 (텍스트) 블록
    case 'paragraph':
      return (
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
          {block.content ? (
            <span
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(block.content),
              }}
            />
          ) : (
            ''
          )}
        </p>
      );

    // 제목 1
    case 'heading_1':
      return (
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 mt-8">
          {block.content}
        </h1>
      );

    // 제목 2
    case 'heading_2':
      return (
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 mt-6">
          {block.content}
        </h2>
      );

    // 제목 3
    case 'heading_3':
      return (
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3 mt-4">
          {block.content}
        </h3>
      );

    // 순서 없는 목록
    case 'bulleted_list_item':
      return (
        <ul className="list-disc list-inside mb-2 text-gray-800 dark:text-gray-200">
          <li>{block.content}</li>
        </ul>
      );

    // 순서 있는 목록
    case 'numbered_list_item':
      return (
        <ol className="list-decimal list-inside mb-2 text-gray-800 dark:text-gray-200">
          <li>{block.content}</li>
        </ol>
      );

    // 이미지 블록
    case 'image': {
      const url = block.metadata?.url ? String(block.metadata.url) : '';
      const caption = block.metadata?.caption ? String(block.metadata.caption) : '이미지';
      return (
        <figure className="my-6">
          {url && (
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={url}
                alt={caption}
                fill
                className="rounded-lg shadow-md object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={false}
              />
            </div>
          )}
          {caption && caption !== '이미지' && (
            <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // 비디오 블록
    case 'video': {
      const url = block.metadata?.url ? String(block.metadata.url) : '';
      const caption = block.metadata?.caption ? String(block.metadata.caption) : '';
      return (
        <figure className="my-6">
          {url && (
            <video
              src={url}
              controls
              className="w-full h-auto rounded-lg shadow-md"
            />
          )}
          {caption && (
            <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // 코드 블록
    case 'code':
      return (
        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-50 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono">
            {block.content}
          </code>
        </pre>
      );

    // 인용 블록
    case 'quote':
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded">
          {block.content}
        </blockquote>
      );

    // 구분선
    case 'divider':
      return <hr className="my-6 border-gray-300 dark:border-gray-600" />;

    // 콜아웃 (알림 상자)
    case 'callout': {
      const icon = block.metadata?.icon ? String(block.metadata.icon) : '';
      return (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 my-4">
          <p className="text-blue-900 dark:text-blue-100">
            {icon && <span>{icon} </span>}
            {block.content}
          </p>
        </div>
      );
    }

    // 체크박스
    case 'to_do': {
      const isChecked = Boolean(block.metadata?.checked) || false;
      return (
        <div className="flex items-center gap-3 my-2">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="w-4 h-4 cursor-default"
          />
          <span className={isChecked ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}>
            {block.content}
          </span>
        </div>
      );
    }

    // 토글 (접기/펼치기)
    case 'toggle':
      return (
        <details className="my-4 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-50">
            {block.content}
          </summary>
          <div className="mt-3 text-gray-700 dark:text-gray-300">
            {/* 토글 내 하위 블록은 별도로 처리 필요 */}
          </div>
        </details>
      );

    // 표 (기본)
    case 'table':
      return (
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <tbody>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-gray-50">
                  {block.content}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );

    // 일반 텍스트 (기본값)
    default:
      return (
        <p className="text-gray-800 dark:text-gray-200 mb-4">
          {block.content}
        </p>
      );
  }
}

/**
 * 여러 Notion 블록을 렌더링하는 컴포넌트
 */
interface NotionBlocksProps {
  // Notion 블록 배열
  blocks: NotionBlock[];
}

export function NotionBlocks({ blocks }: NotionBlocksProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {blocks.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
