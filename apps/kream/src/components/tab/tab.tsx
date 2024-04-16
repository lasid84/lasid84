import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";

export interface tab {
    cd: any;
    cd_nm: string;
};

type Props = {
    init?: boolean; // 초기화
    tabList: tab[] | undefined; // 탭 리스트
    MselectedTab?: string;
    onClickTab: (selectedTab: any) => void;
    onClickICON?: (selectedTab: any) => void;
};

export default function Tab({ tabList, onClickTab }: Props) {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<any>("NM");

    useEffect(() => {
        selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);

    return (
        <div className="w-full flex ">
            <div className="flex flex">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="px-1 flex bg-transparent">

                        <button
                            onClick={() => setSelectedTab(cd)}
                            className={
                                cd === selectedTab
                                    ? "px-1 flex font-medium items-center text-xs px-2 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "px-1 flex font-medium items-center text-xs px-2 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            } type="button">
                            <div className="space-x-1 px-1 w-5 h-5 flex-row text-xs items-center bg-blue-300 rounded-full text-white">{idx + 1}</div>
                            {t(cd_nm)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}



export function TabICON({ tabList, onClickTab, onClickICON, MselectedTab }: Props) {
    const { t } = useTranslation();
    return (
        <div className="w-full flex ">
            <div className="flex flex">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="flex-none bg-transparent">
                        <button
                            id={cd}
                            onClick={onClickTab}
                            className={
                                cd === MselectedTab
                                    ? "font-medium text-xs px-2 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "font-medium text-xs px-2 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            }
                            type="button">
                            <div className="flex flex-row items-center p-1"  id={cd}>
                                {/* <div className="bg-blue-200 rounded">{idx + 1}</div> */}
                                {t(cd_nm)}
                                {cd && cd !== 'Main' ? <span className="p-2" onClick={onClickICON}><AiOutlineClose id={cd} /></span> : <></>}
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}