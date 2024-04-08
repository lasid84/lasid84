import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface tab {
    cd: any;
    cd_nm: string;
};

type Props = {
    init?: boolean; // 초기화
    tabList: tab[] | undefined; // 탭 리스트
    onClickTab: (selectedTab: any) => void;
};

export default function Tab({ tabList, onClickTab }: Props) {
    const {t} = useTranslation();
    const [selectedTab, setSelectedTab] = useState<any>("NM");

    useEffect(() => {
        selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);

    return (
        <div className="w-full flex ">
            <div className="flex flex">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="flex-none bg-transparent">
                        <button
                            onClick={() => setSelectedTab(cd)}
                            className={
                                cd === selectedTab
                                    ? "font-medium text-xs px-2 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "font-medium text-xs px-2 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            }
                            type="button">
                            {t(cd_nm)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
