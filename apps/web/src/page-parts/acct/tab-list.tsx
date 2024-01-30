import React, { useEffect, useState } from "react";

type tab = {
  code_name: string;
  code: any;
};

type Props = {
  init?: boolean; // 초기화
  tabList: tab[] | undefined; // 탭 리스트
  allYn?: boolean; // 전체보기
  onClickTab: (selectedTab: any) => void;
};

  export const Tab: React.FC<Props> = ({ tabList, allYn = false, onClickTab }: Props) => {
    const [selectedTab, setSelectedTab] = useState<any>(allYn ? "ALL" : "");

    useEffect(() => {
      selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);
  
    useEffect(() => setSelectedTab(allYn ? "ALL" : ""), [allYn]);
  

    return (
      <div className="flex mb-[-14px] mt-[-12px]">
      <div className="flex flex-row space-x-1">
        {tabList?.map(({ code_name, code }, idx) => (
            <div key={idx} className="flex-none  bg-transparent">
              <button
                  onClick={() => setSelectedTab(code)}
                  className={
                    code === selectedTab
                        ? "font-bold text-md px-4 py-3 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                        : "font-bold text-md px-4 py-3 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                  }
                  type="button">
                {code_name}
              </button>
            </div>
        ))}
      </div>
    </div>
    );
  };
  