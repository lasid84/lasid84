
'use client'
import { useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageContent from "layouts/search-form/page-content"
import { useState } from "react"
import Tab, { tab } from "components/tab/tab"
import MainPage from "./MainPage";
import DTDPage from "./DTDPage";

import { log } from '@repo/kwe-lib-new';
import { pages, useCommonStore } from "../../_store/store";
import { useTranslation } from "react-i18next";
import { TbFlagSearch } from "react-icons/tb";

export interface typeloadItem {
    data: {} | undefined
}
type Props = {
    loadItem?: any;
};

const CustomerDetail: React.FC<Props> = memo(({ loadItem }) => {
    const { t } = useTranslation();
    const [pMain, pDTD, pFH, pRATE] = pages;
    const tabList = [
        {cd:pMain, cd_nm:t(pMain)}, 
        {cd:pDTD, cd_nm:t(pDTD)}, 
        {cd:pFH, cd_nm:t(pFH)}, 
        {cd:pRATE, cd_nm:t(pRATE)}
    ]
    const {selectedTab} = useCommonStore((state) => state);
    const actions = useCommonStore((state) => state.actions);
    
    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
        },
    });
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = formZodMethods;

    const handleOnClickTab = (code: any) => { actions.setState({selectedTab: code}) }

    const checkCurrentPage = (cPage: string) => {
        if (selectedTab === cPage) return '';
        else return 'hidden';
    }

    return (
        <div className="flex flex-col w-full gap-2 space-y-2">
            <PageContent
                left={<Tab tabList={tabList} MselectedTab={selectedTab} onClickTab={handleOnClickTab} />}
                right={<></>}>
                <div className={`flex flex-col w-full ${checkCurrentPage(pMain)}`}>
                    <MainPage/>
                </div>
                <div className={`w-full h-full flex flex-col ${checkCurrentPage(pDTD)}`}>
                    <DTDPage/>
                </div>
                <div className={`w-full h-full flex flex-col ${checkCurrentPage(pFH)}`}>
                </div>
                <div className={`w-full flex flex-col overflow-auto ${checkCurrentPage(pRATE)}`}>
                </div>
            </PageContent>
        </div>
    );
})

export default CustomerDetail;