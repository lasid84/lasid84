import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const { log } = require('@repo/kwe-lib/components/logHelper')

export const GroupBox = ({ title, children }: { title: string; children: React.ReactNode }) => {

    const containerRef = useRef(null);
    const [backgroundColor, setBackgroundColor] = useState('');
    const { t } = useTranslation();

    const getBackgroundColor = (element: HTMLElement | null): string => {
        if (!element) return 'white'; // 기본 배경색을 white로 설정
    
        const computedStyle = getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
    
        if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          return bgColor;
        }
    
        return getBackgroundColor(element.parentElement);
      };
    
      useEffect(() => {
        if (containerRef.current) {
          setBackgroundColor(getBackgroundColor(containerRef.current));
        }
      }, []);

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        border: '0.5px solid gray',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px',
        backgroundColor: 'inherit', // 부모 배경색 상속
      };
    
      const titleStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-10px',
        left: '10px',
        backgroundColor: backgroundColor,
        padding: '0 5px',
      };

      const contentStyle: React.CSSProperties = {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      };

    return (
        <div ref={containerRef} style={containerStyle}>
            <div className="justify-center text-xs font-medium" style={titleStyle}>
                {t(title)}
            </div>
            <div style={contentStyle}>
                {children}
            </div>
        </div>
    );
  };

  