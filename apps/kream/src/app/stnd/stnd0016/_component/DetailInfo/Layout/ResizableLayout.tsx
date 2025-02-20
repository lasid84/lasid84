"use client";
import React, { useRef, useState, useEffect, useCallback, ReactNode} from "react";

interface ResizableLayoutProps {
  /** 왼쪽에 들어갈 JSX/컴포넌트 */
  leftContent: ReactNode;
  /** 오른쪽에 들어갈 JSX/컴포넌트 */
  rightContent: ReactNode;

  /** 컨테이너 기본 높이(px) */
  defaultHeight?: number;
  /** 컨테이너 최소 높이(px) */
  minHeight?: number;
  /** 컨테이너 최대 높이(px) */
  maxHeight?: number;

  /** 왼쪽 패널의 기본 너비(px) */
  defaultLeftWidth?: number;
  /** 왼쪽 패널 최소 너비(px) */
  minLeftWidth?: number;
  /** 왼쪽 패널 최대 너비(px) */
  maxLeftWidth?: number;
  /* 초기 useEffect세팅 비율 */
  ratio?: number;
}

/**
 * 좌/우 분할 + 컨테이너 자체의 세로 크기도 조절 가능한 컴포넌트
 */
const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftContent,
  rightContent,

  defaultHeight = 200,
  minHeight = 100,
  maxHeight = 1000,

  defaultLeftWidth = 300,
  minLeftWidth = 100,
  maxLeftWidth = 2000,
  ratio,
}) => {
  // [1] 전체 컨테이너 높이 관리
  const [containerHeight, setContainerHeight] = useState<number>(defaultHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  // [2] 왼쪽 패널 너비 관리 (기존 코드와 동일)
  const [leftWidth, setLeftWidth] = useState<number>(defaultLeftWidth);
  const topInnerRef = useRef<HTMLDivElement>(null);

  /* -----------------------------------------------
     마운트 시, 현재 높이/너비를 확인하여 초기값 조정
  -------------------------------------------------- */
  // useEffect(() => {
  //   if (containerRef.current) {
  //     const initial = Math.min(
  //       Math.max(defaultHeight, minHeight),
  //       maxHeight
  //     );
  //     setContainerHeight(initial);
  //   }
  // }, [defaultHeight, minHeight, maxHeight]);

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
            const clamped = Math.min(Math.max(half, minLeftWidth), maxLeftWidth);

          setLeftWidth(clamped);
      }
  }, [minLeftWidth, maxLeftWidth]);

  /* -----------------------------------------------
     (A) 세로 핸들: 컨테이너 전체 높이 조절
  -------------------------------------------------- */
  const onMouseDownHorizontal = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current) return;

        // container의 상단 위치
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const newHeight = moveEvent.clientY - containerTop;

        if (newHeight < minHeight) {
          setContainerHeight(minHeight);
        } else if (newHeight > maxHeight) {
          setContainerHeight(maxHeight);
        } else {
          setContainerHeight(newHeight);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [minHeight, maxHeight]
  );

  /* -----------------------------------------------
     (B) 수직 핸들: 왼/오른쪽 분할
  -------------------------------------------------- */
  const onMouseDownVertical = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

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

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [minLeftWidth, maxLeftWidth]
  );

  /* -----------------------------------------------
     실제 렌더
  -------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      className="relative border"
      style={{
        // 드래그로 변경되는 높이를 적용
        height: containerHeight,
      }}
    >
      {/* (1) 좌우 분할 영역 */}
      <div ref={topInnerRef} className="flex flex-row w-full h-full">
        {/* 왼쪽 패널 */}
        <div
          className="p-1 bg-white shadow"
          style={{ width: leftWidth }}
        >
          {leftContent}
        </div>
        {/* 수직 드래그 핸들 */}
        <div
          className="bg-gray-300 hover:bg-gray-400 cursor-col-resize"
          style={{ width: 4 }}
          onMouseDown={onMouseDownVertical}
        />
        {/* 오른쪽 패널 */}
        <div className="flex-1 p-1 shadow bg-gray-50">
          {rightContent}
        </div>
      </div>

      {/* (2) 컨테이너 하단의 수평 드래그 핸들 (세로 크기 조절) */}
      <div
        className="absolute bottom-0 w-full h-1 bg-gray-400 hover:bg-gray-500 cursor-row-resize"
        onMouseDown={onMouseDownHorizontal}
        style={{
          // zIndex를 높여야 아래 내용 위에 제대로 올라옵니다
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default ResizableLayout;
