import { useEffect, useState, useRef, MutableRefObject } from "react";

/**
 * @Hook
 * Summary : div 단위의 component를 단축키 입력 시 전체화면으로 변환.
 * [ Details ]
 * * 사용법
 * 해당 hook 호출 후 return 되는 containerRef를 확대하고 싶은 div의 ref 속성에 입력.
 * ! 단축키는 ctrl + /로 설정.
 */
type useFullScreenReturn = {
    containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const useFullScreen = (): useFullScreenReturn => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleEnterFullScreen = () => {
        if (containerRef.current && containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen()
                .then(() => setIsFullScreen(true));
        }
    };

    const handleExitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen()
                .then(() => setIsFullScreen(false))
                .catch(() => setIsFullScreen(false));
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key.toLowerCase() === "/") {
            event.preventDefault();
            if (!isFullScreen) {
                handleEnterFullScreen();
            } else {
                handleExitFullScreen();
            }
        }

        if (event.code === "Escape") {
            setIsFullScreen(false);
            event.preventDefault();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    },[]);

    useEffect(() => {
        if (containerRef.current) {
            if (isFullScreen) {
                containerRef.current.classList.add('overflow-auto');
            } else {
                containerRef.current.classList.remove('overflow-auto');
            }
        }
    }, [isFullScreen]);

    return { containerRef };
};