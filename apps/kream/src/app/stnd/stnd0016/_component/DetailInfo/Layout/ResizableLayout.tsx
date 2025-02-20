'use client'
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ResizableLayoutProps {
  /** 왼쪽 패널에 들어갈 JSX/컴포넌트 */
  leftContent: React.ReactNode;
  /** 오른쪽 패널에 들어갈 JSX/컴포넌트 */
  rightContent: React.ReactNode;
  /** 초기 왼쪽 패널 너비 (px) */
  defaultLeftWidth?: number;
  /** 최소 왼쪽 패널 너비 (px) */
  minLeftWidth?: number;
  /** 최대 왼쪽 패널 너비 (px) */
  maxLeftWidth?: number;
  /* 초기 useEffect세팅 비율 */
  ratio?: number;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftContent,
  rightContent,
  defaultLeftWidth = 300,
  minLeftWidth = 100,
  maxLeftWidth = 2000,
  ratio,
}) => {
    // 왼쪽 패널 현재 너비(px)
    const [leftWidth, setLeftWidth] = useState<number>(defaultLeftWidth);
      
    // 컨테이너 (전체 레이아웃) 참조
    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * 마운트 후 한 번만 실행: 컨테이너의 실제 너비 측정 -> 반으로 설정
     * (clientWidth를 바로 알 수 있으려면 DOM이 렌더된 뒤라야 가능)
     */
    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;

            let newWidth;

            if (ratio !== undefined) {
              newWidth = (containerWidth * ratio) / 100; // ratio 값이 있으면 비율 적용
          } else {
              const half = containerWidth / 2; // ratio가 없으면 기존 half 로직 사용
              newWidth = half;
          }


        // min/max 제한 적용
        const clamped = Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth);

            // 만약 min/max 제한 적용을 원한다면 아래처럼 사용
            // const clamped = Math.min(Math.max(half, minLeftWidth), maxLeftWidth);

            setLeftWidth(clamped);
        }
    }, [minLeftWidth, maxLeftWidth]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        // 드래그 중에 마우스 이동 시 호출
        const handleMouseMove = (moveEvent: MouseEvent) => {
          if (containerRef.current) {
              const containerLeftX = containerRef.current.getBoundingClientRect().left;
              const newLeftWidth = moveEvent.clientX - containerLeftX;

              // 최소/최대 폭 제한 로직
              if (newLeftWidth < minLeftWidth) {
              setLeftWidth(minLeftWidth);
              } else if (newLeftWidth > maxLeftWidth) {
              setLeftWidth(maxLeftWidth);
              } else {
              setLeftWidth(newLeftWidth);
              }
          }
        };

        // 드래그 끝났을 때 호출
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        // 드래그 시작: document 레벨 리스너 등록
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }, [minLeftWidth, maxLeftWidth]);

  return (
    <div className="flex flex-col w-full h-full">
    <div ref={containerRef} className={`flex-1 flex w-full `}>
      {/* 왼쪽 영역 */}
      <div
        className="shadow-md"
        style={{ width: leftWidth }}
      >
        {leftContent}
      </div>

      {/* 드래그 핸들 */}
      <div
        className="bg-gray-300 hover:bg-gray-400 cursor-col-resize"
        style={{ width: '6px' }}
        onMouseDown={handleMouseDown}
      />

      {/* 오른쪽 영역 */}
      <div className="flex-1 bg-white">
        {rightContent}
      </div>
    </div>
  </div>
  );
};

export default ResizableLayout;
