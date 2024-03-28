import clsx from "clsx";
import Colors, { PaletteProps } from "./colors";
import Close from "./close";
import Sidebar from "./sidebar";
import Langs from "./langs";
import { BaseSyntheticEvent, useRef, useEffect, useState, RefObject, memo } from "react";
import { useConfigs } from "states/useConfigs";

const RightSidebar: React.FC = memo(() => {
  const colors: PaletteProps[] = [
    { bg: "bg-white", text: "text-white", name: "light" },
    { bg: "bg-gray-900", text: "text-gray-900", name: "dark" },
  ];
  const items = [{ title: "Background", key: "background" }];
  const config = useConfigs((state) => state.config);
  const { rightSidebar } = config;



  const rightSideBarRef:RefObject<HTMLDivElement> = useRef(null);
  const configActions = useConfigs((state) => state.actions);

  const [translate, setTranslate] = useState("translate-x-64");
  useEffect(() => {
    rightSidebar ? setTranslate("translate-x-0") : setTranslate("translate-x-64");
  }, [rightSidebar]);

  // 바깥 배경 클릭하는경우  rightsidebar 닫힘
  useEffect(() => {
    const handleOutsideClick = (event: BaseSyntheticEvent | MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const isInside = rightSideBarRef?.current?.contains(event.target);
      if (rightSideBarRef && !isInside) {
        configActions.setConfig({ rightSidebar: false })
      }
    }
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    }
  }, [rightSideBarRef])


  return (
    <div ref={rightSideBarRef}
      className={`bg-white text-gray-900 text-sm w-[230px] transform transition duration-300 ease-in-out shadow fixed top-0 bottom-0 h-screen overflow-hidden z-[99] right-0 ${translate}`}>
      <div className="absolute top-0 bottom-0 left-0 h-full overflow-x-auto">
        <div className="w-[230px] h-full">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between h-16 px-4 text-white bg-blue-500">
              <div className="text-sm font-bold tracking-wider uppercase">
                Settings
              </div>
              {/* Right SideBar Toggle */}
              <Close />
            </div>
          </div>

          {/* 언어 선택 */}
          <Langs />

          {/* 메뉴바 토글 */}
          <Sidebar />

          <div className="flex flex-col p-4">
            <div className="mb-2">
              <div className="mb-2 text-sm font-bold tracking-wider uppercase">
                Colors
              </div>
            </div>

            {items.map((item) => (
              <Colors key={item.key} title={item.title} palettes={colors} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default RightSidebar;
