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
    const { MselectedTab = 'NM' } = props
    const [selectedTab, setSelectedTab] = useState<any>(MselectedTab);

    const { loadItem, onClickTab, tabList} = props;
    // const [tabList, settabList] = useState<tab[]>()

    // useEffect(() => {
    //     if (loadItem?.length) {
    //         // console.log('loadItem',loadItem[14].data)
    //         settabList(loadItem[14].data)
    //         // console.log('tabState',loadItem[14].data)
    //     }
    // }, [loadItem?.length])

    useEffect(() => {
        // console.log('tabState_selectedTab',selectedTab)
        selectedTab && onClickTab(selectedTab);
    }, [selectedTab]);

    useEffect(() => {
        MselectedTab && onClickTab(MselectedTab);
    }, [MselectedTab]);

    return (
        <div className="flex flex-row justify-center overflow-x-auto dark:bg-gray-900 dark:text-white dark:border-gray-800">
            {tabList?.map(({ cd, cd_nm }, idx) => (
                <div key={idx} className="flex flex-row bg-transparent w-34 min-w-32">
                    <button
                        onClick={() => setSelectedTab(cd)}
                        className={
                            cd === selectedTab
                                ? "flex font-medium items-center text-xs px-1 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                                : "flex font-medium items-center text-xs px-1 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                        } type="button">
                        <div className="flex-row items-center w-5 h-5 text-xs text-center text-white bg-blue-300 border-2 rounded-full">{idx + 1}</div>
                        <div className="flex min-h-full">
                            <div className="flex items-center self-center place-content-around min-w-20">{t(cd_nm)}</div>
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
        <div className="fixed z-30 flex w-full bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800">
            <div className="flex">
                {tabList?.map(({ cd, cd_nm }, idx) => (
                    <div key={idx} className="flex flex-row p-1 bg-transparent ">
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