import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";

export interface tab {
    cd: any;
    cd_nm: string;
};

type Props = {
    init?: boolean; // 초기화
    tabList?: tab[] | undefined; // 탭 리스트
    MselectedTab?: string;
    loadItem?: any | null
    options?: {
        tabAlign?: string;
    }
    onClickTab: (selectedTab: any) => void;
    onClickICON?: (selectedTab: any) => void;
};

export const SubMenuTab: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<any>("NM");

    const { loadItem, onClickTab, } = props;
    const [tabList, settabList] = useState<tab[]>()

    useEffect(() => {
        if (loadItem?.length) {
            settabList(loadItem[14].data)
            console.log('왜?', tabList)
        }
    }, [loadItem?.length])

    useEffect(() => {
        selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);

    return (
       
            <div className="flex flex-row overflow-x-auto justify-center">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="px-1 flex flex-row bg-transparent">
                        <button
                            onClick={() => setSelectedTab(cd)}
                            className={
                                cd === selectedTab
                                    ? "px-1 flex font-medium items-center text-xs px-2 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "px-1 flex font-medium items-center text-xs px-2 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            } type="button">
                            <div className="border-2 w-5 h-5 flex-row text-xs items-center bg-blue-300 rounded-full text-white text-center">{idx + 1}</div>
                            <div className="flex min-h-full">
                                <div className="flex items-center self-center place-content-around">{t(cd_nm)}</div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
       
    );
}

export function WBMenuTab({ tabList, onClickTab, onClickICON, MselectedTab }: Props) {
    const { t } = useTranslation();
    return (
        <div className="w-full flex">
            <div className="flex">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="p-1 flex flex-row bg-transparent">
                        <button
                            id={cd}
                            onClick={onClickTab}
                            className={
                                cd === MselectedTab
                                    ? "font-medium text-xs px-1 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                    : "font-medium text-xs px-1 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                            }
                            type="button">{t(cd_nm)}</button>
                        {cd && cd !== 'Main' ? <span className={cd === MselectedTab
                            ? "flex p-1 items-center font-medium text-xs leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500 mouse-hover"
                            : "flex p-1 items-center font-medium text-xs leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500 mouse-hover"} onClick={onClickICON}>
                            <AiOutlineClose id={cd} /></span> : <></>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SubMenuTab