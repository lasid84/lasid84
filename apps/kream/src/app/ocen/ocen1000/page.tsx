
'use client';

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load, SP_GetBKDetailData } from "./_component/data";
import { reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_MD } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useState } from 'react'
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import { WBMenuTab } from "components/tab/tab"
import BKMainTab from "./_component/bkMainTab"
import BKMain from "./_component/bkMain";
import BKCargo from "./_component/bkCargo";
import { useUserSettings } from "states/useUserSettings";
import BKSchedule from "./_component/bkSchedule";
import { shallow } from "zustand/shallow";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { getMenuParameters } = require('@repo/kwe-lib/components/menuParameterHelper.js');

export default function OCEN1000() {

    const [selectedTab, setselectedTab] = useState<string>("NM");
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isMDSearch: false,
            isDSearch: false,
            isPKCSearch : false,
            mSelectedRow: {},
            mSelectedCargo: {},
            dSelectedRow: {},
            tab1: [],
            MselectedTab: 'Main',
            isFirstRender: true,
            cont_type: '',  //
            trans_mode: '',
            trans_type: '',
            gridRef_m: useRef<any | null>(null),
            isShpPopUpOpen: false,
            isCarrierPopupOpen : false,
            isCYPopupOpen : false,
            isPickupPopupOpen : false,
            selectedobj: {},
            mGridState: {},
            mGridStateInit:null
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, mSelectedCargo, crudType, isMSearch, isShpPopUpOpen, MselectedTab, isPKCSearch, isFirstRender } = objState;
    const val = useMemo(() => { return { objState, searchParams, mSelectedRow, crudType, isMSearch, isPKCSearch, isShpPopUpOpen, mSelectedCargo, dispatch } }, [state]);

    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const { data: mainData, refetch: mainRefetch } = useGetData({ no: objState?.MselectedTab }, SEARCH_MD, SP_GetBKDetailData, { enabled: false }); //1건 Detail조회

    //사용자 정보
    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    useEffect(() => {
        const params = getMenuParameters(menu_param);
        dispatch({ cont_type: params.cont_type, trans_mode: params.trans_mode, trans_type: params.trans_type });
        // log('cont_type? OCEN1000', params)
    }, [menu_param])

    useEffect(() => {
        if (initData) {
            if (objState.tab1.length < 1) { objState.tab1.push({ cd: 'Main', cd_nm: 'Main' }) }
        }
    }, [initData])

    useEffect(() => {
        if (objState.isMDSearch) {
            mainRefetch();
            log("main MDSearch", objState.isMDSearch);
            dispatch({ isMDSearch: false });
        }
    }, [objState?.isMDSearch]);
    

    const handleOnClickTab = (code: any) => {
        //tab click event , 작성중인경우, update 한 경우 팝업알림(저장)
        setselectedTab(code)
    }
    const MhandleOnClickTab = (code: any) => {
        if (code.target.id === 'Main') { dispatch({ MselectedTab: code.target.id }) }
        else {
            dispatch({ isMDSearch: true, MselectedTab: code.target.id, mSelectedRow: { ...mSelectedRow, no: code.target.id } })
        }
    }
    const MhandleonClickICON = (code: any) => {
        let filtered = objState.tab1.filter((element: any) => { return element.cd != code.target.id })
        dispatch({ tab1: filtered, MselectedTab: filtered[filtered.length - 1].cd, mSelectedRow: { ...mSelectedRow, no: filtered[filtered.length - 1].cd } })
    }

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <WBMenuTab tabList={objState.tab1} onClickTab={MhandleOnClickTab} onClickICON={MhandleonClickICON} MselectedTab={MselectedTab} />
                {/* WayBill Main List 화면 */}
                {objState.MselectedTab == "Main" ? <>
                    <SearchForm loadItem={initData} />
                    <div className={`w-full h-[calc(100vh-210px)] flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
                        <div className="w-full">
                            <MasterGrid initData={initData} /></div>
                    </div></> : <>

                    {/* Booking Note Detail 화면 상단{Tab} */}
                    <BKMainTab loadItem={initData} mainData={mainData} onClickTab={handleOnClickTab} />

                    {/* Booking Note Detail 화면 하단(Sub) */}
                    <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                        <BKMain loadItem={initData} mainData={mainData} />
                    </div>
                    <div className={`w-full flex ${selectedTab == "SK" ? "" : "hidden"}`}>
                        <BKSchedule loadItem={initData} mainData={mainData} />
                    </div>
                    <div className={`w-full flex ${selectedTab == "CG" ? "" : "hidden"}`}>
                        <BKCargo loadItem={initData} mainData={mainData} />
                    </div>
                </>}
            </div>
        </TableContext.Provider>
    );
}
