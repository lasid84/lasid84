import React, { useEffect, useState } from "react";

type tab = {
    code: any;
    cd_name: string;
};

type Props = {
    init?: boolean; // 초기화
    tabList: tab[] | undefined; // 탭 리스트
    allYn?: boolean; // 전체보기
    onClickTab: (selectedTab: any) => void;
};

export default function Tab({ tabList, allYn = false, onClickTab }: Props) {
    const [selectedTab, setSelectedTab] = useState<any>(allYn ? "ALL" : "NORMAL");

    useEffect(() => {
        selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);

    useEffect(() => setSelectedTab(allYn ? "ALL" : ""), [allYn]);

    return (
        <div className="flex">
            <div className="flex flex space-x-1">
                {tabList?.map(({ code, cd_name }, idx) => (
                    <div key={idx} className="flex-none  bg-transparent">
                        <button
                            onClick={() => setSelectedTab(code)}
                            className={
                                code === selectedTab
                                    ? "font-bold text-md px-4 py-3 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "font-bold text-md px-4 py-3 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            }
                            type="button">
                            {cd_name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
