
'use client'
import { useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageContent from "layouts/search-form/page-content"
import { useState } from "react"
import Tab, { tab } from "components/tab/tab"
import MainPage from "./MainPage";
import DTDPage from "./DTDPage";

import { log } from '@repo/kwe-lib-new';
import { useCommonStore } from "../../_store/store";

export interface typeloadItem {
    data: {} | undefined
}
type Props = {
    loadItem?: any;
};

const CustomerDetail: React.FC<Props> = memo(({ loadItem }) => {
    const [tab, settab] = useState<tab[]>()
    // const [selectedTab, setselectedTab] = useState<string>("NM");
    const {selectedTab} = useCommonStore((state) => state);
    const actions = useCommonStore((state) => state.actions);

    useEffect(() => {
        if (loadItem?.length) {
            // log("loadItem111111", loadItem[14].data)
            settab(loadItem[14].data)
        }
    }, [loadItem?.length])
    
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

    return (
        <div className="flex flex-col w-full gap-2 space-y-2">
            <PageContent
                left={<Tab loadItem={[{cd:'NM', cd_nm:'메인페이지'}, {cd:'DTD', cd_nm:'DTD페이지'}, {cd:'FH', cd_nm:'F/H페이지'}, {cd:'RATE', cd_nm:'Rate페이지'}]} onClickTab={handleOnClickTab} />
                }
                right={<></>}>
                <div className={`flex flex-col w-full ${selectedTab == "NM" ? "" : "hidden"}`}>
                    <MainPage/>
                </div>
                <div className={`w-full h-full flex flex-col ${selectedTab == "DTD" ? "" : "hidden"}`}>
                    <DTDPage/>
                </div>
                <div className={`w-full h-full flex flex-col ${selectedTab == "FH" ? "" : "hidden"}`}>
                </div>
                <div className={`w-full flex flex-col overflow-auto ${selectedTab == "RATE" ? "" : "hidden"}`}>
                </div>
            </PageContent>
        </div>
    );
})

export default CustomerDetail;