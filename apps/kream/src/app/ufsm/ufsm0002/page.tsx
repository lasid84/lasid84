
'use client';

import { useEffect, useReducer, useMemo, useCallback, memo } from "react";
import { SP_Load, SP_GetMasterData, SP_GetWBDetailData } from "./_component/data";
import { reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_MD } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useState } from 'react'
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import SubMenuTab, { tab, WBMenuTab } from "components/tab/tab"
import { useSearchParams } from 'next/navigation'
import WBMain from "./_component/wbMain";
import WBSub from "./_component/wbSub";
import WBMainTab from "./_component/wbMainTab"
import WBCharges from "./_component/wbCharges"
import WBShipmentDetails from "./_component/wbShipmentDetails"
import WBShipmentText from "./_component/wbShipmentText";
import WBReference from "./_component/wbreferences";
import { useUserSettings } from "@/states/useUserSettings";
import { shallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";


const { log } = require('@repo/kwe-lib/components/logHelper');


export default function UFSM0002() {

    const [selectedTab, setselectedTab] = useState<string>("NM");
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            isIFPopUpOpen: false,
            isPrintPopUpOpen: false,
            mSelectedRow: {},
            mSelectedDetail: {},
            dSelectedRow: {},
            dSelectedNo: "",
            tab1: [],
            MselectedTab: 'Main',
            isFirstRender: true,
            mGridState: {}
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, mSelectedDetail, crudType, isMSearch, isPopUpOpen, MselectedTab, isFirstRender } = objState;

    //사용자 정보
    const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
    const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

    const methods = useForm({
    defaultValues: {
        trans_mode: gTransMode || 'ALL',
        trans_type: gTransType || 'ALL',
        fr_date: dayjs().subtract(0, 'month').startOf('month').format("YYYYMMDD"),
        to_date: dayjs().format("YYYYMMDD"),
        wb_no: '',
        cust_code: ''
    }
    });

    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        getValues,
        register,
        formState: { errors, isSubmitSuccessful },
    } = methods;

    const val = useMemo(() => { return { objState, searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen, mSelectedDetail, dispatch } }, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const { data: mainData, refetch: mainRefetch } = useGetData({ wb_no: objState?.MselectedTab }, SEARCH_MD, SP_GetWBDetailData, { enabled: false });

    const handleOnClickTab = (code: any) => { setselectedTab(code) }
    const MhandleOnClickTab = (code: any) => {
        if (code.target.id === 'Main') { dispatch({ MselectedTab: code.target.id }) }
        else {
            dispatch({ isMDSearch: true, MselectedTab: code.target.id, mSelectedRow: { ...mSelectedRow, mwb_no: code.target.id } })
        }
    }
    const MhandleonClickICON = (code: any) => {
        let filtered = objState.tab1.filter((element: any) => { return element.cd != code.target.id })
        dispatch({ tab1: filtered, MselectedTab: filtered[filtered.length - 1].cd, mSelectedRow: { ...mSelectedRow, mwb_no: filtered[filtered.length - 1].cd } })
    }


    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (objState.isMDSearch) {
            mainRefetch();
            // log("main MDSearch", objState.isMDSearch);
            dispatch({ isMDSearch: false });
        }
    }, [objState?.isMDSearch]);



    useEffect(() => {
        if (initData) {
            if (objState.tab1.length < 1) { objState.tab1.push({ cd: 'Main', cd_nm: 'Main' }) }
        }
    }, [initData])


    return (
        <TableContext.Provider value={val}>
            <FormProvider {...methods}>
                <div className={`w-full h-full`}>
                <WBMenuTab tabList={objState.tab1} onClickTab={MhandleOnClickTab} onClickICON={MhandleonClickICON} MselectedTab={MselectedTab} />
                {/* WayBill Main List 화면 */}
                {objState.MselectedTab == "Main" ? <div className={`w-full h-[calc(100vh-210px)] flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
                    <SearchForm loadItem={initData} />
                    <MasterGrid initData={initData} />
                </div> : <>
                    {/* WayBill Detail 화면 상단{Tab} */}
                    <WBMainTab loadItem={initData} mainData={mainData} onClickTab={handleOnClickTab} />
                    {/* <SubMenuTab loadItem={initData} onClickTab={handleOnClickTab} /> */}

                    {/* WayBill Detail 화면 하단(Sub) */}
                    <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                        <WBMain loadItem={initData} mainData={mainData} />
                    </div>

                    <div className={`w-full flex ${selectedTab == "WS" ? "" : "hidden"}`}>
                        <WBSub loadItem={initData} mainData={mainData} />
                    </div>
                    <div className={`w-full flex ${selectedTab == "SD" ? "" : "hidden"}`}>
                        <WBShipmentDetails initData={initData} mainData={mainData} />
                    </div>

                    <div className={`w-full flex ${selectedTab == "CG" ? "" : "hidden"}`}>
                        <WBCharges initData={initData} mainData={mainData} />
                    </div>
                    <div className={`w-full flex ${selectedTab == "ST" ? "" : "hidden"}`}>
                        <WBShipmentText loadItem={initData} mainData={mainData} />
                    </div>

                    <div className={`w-full flex ${selectedTab == "RF" ? "" : "hidden"}`}>
                        <WBReference loadItem={initData} mainData={mainData} />
                    </div>


                </>}
                </div>
            </FormProvider>
        </TableContext.Provider>
    );
}
