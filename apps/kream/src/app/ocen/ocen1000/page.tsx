"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load, SP_GetMData } from "./_component/data";
import {
  reducer,
  TableContext,
} from "components/provider/contextObjectProvider";
import {
  LOAD,
  SEARCH_M,
  SEARCH_MD,
} from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form";
import { useState } from "react";
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from "./_component/gridMaster";
import { WBMenuTab } from "components/tab/tab";
import BKMainTab from "./_component/bkMainTab";
import BKMain from "./_component/bkMain";
import BKCargo from "./_component/bkCargo";
import BKCost from "./_component/bkCost";
import { useUserSettings } from "states/useUserSettings";
import BKSchedule from "./_component/bkSchedule";
import { shallow } from "zustand/shallow";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { FormProvider, useForm } from "react-hook-form";

const { log } = require("@repo/kwe-lib/components/logHelper");
const {
  getMenuParameters,
} = require("@repo/kwe-lib/components/menuParameterHelper.js");

export default function OCEN1000() {
  const [selectedTab, setselectedTab] = useState<string>("NM");
  const [state, dispatch] = useReducer(reducer, {
    objState: {
      searchParams: {},
      isMSearch: false,
      isMDSearch: false,
      isCGOSearch: false,   //Cargo
      isCSTSearch : false,  //Cost
      isRefresh : false,
      mSelectedRow: {},
      mSelectedCargo: {},
      tab1: [{ cd: "Main", cd_nm: "Main" }],
      MselectedTab: "Main",
      isFirstRender: true,    //화면 처음 렌더링시에만 조회버튼 클릭 되도록 하기위한 state
      trans_mode: "",
      trans_type: "",
      gridRef_m: useRef<any | null>(null),
      isShpContPopUpOpen: false,
      isCarrierContPopupOpen: false,
      isCYPopupOpen: false,
      isCYContPopupOpen:false,
      isPickupPopupOpen: false,
      isMailRcvPopupOpen:false,
      isMailSendPopupOpen : false, //send_mail
      isWaybillPopupOpen:false,
      mGridState: {},
      mGridStateInit: null
    },
  });
  const { objState } = state;
  const {
    searchParams,
    mSelectedRow,
    mSelectedCargo,
    crudType,
    isMSearch,
    isShpPopUpOpen,
    MselectedTab,
    isPKCSearch,
  } = objState;

  
  
  const val = useMemo(() => {
    return {
      objState,
      searchParams,
      mSelectedRow,
      crudType,
      isMSearch,
      isPKCSearch,
      isShpPopUpOpen,
      mSelectedCargo,
      dispatch,
    };
  }, [state]);

  const methods = useForm({
    defaultValues: {
      // bk_dd : bkData?.bk_dd ? bkData?.bk_dd : dayjs().format('yyyymmdd')
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



  const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60});
  const { data: detailData, refetch: detailRefetch } = useGetData({ no: objState?.MselectedTab }, "", /*SP_GetBKDetailData*/ SP_GetMData, { enabled: false }); //1건 Detail조회

  //사용자 정보
  const menu_param = useUserSettings((state) => state.data.currentParams,shallow);

  useEffect(() => {
    const params = getMenuParameters(menu_param);
    log("params", params)
    dispatch({
      trans_mode: params.trans_mode,
      trans_type: params.trans_type,
    });
  }, [menu_param]);

  // useEffect(() => {
  //   if (objState.isMSearch) {
  //     mainRefetch();
  //     log("mainisSearch", objState.isMSearch);
  //     dispatch({ isMSearch: false });
  //     if (initData) {
  //       if (objState.tab1.length < 1) {
  //         objState.tab1.push({ cd: "Main", cd_nm: "Main" });
  //       }
  //     }
  //   }
  // }, [initData]);

  useEffect(() => {
    if (objState.isMDSearch) {
      dispatch({ isRefresh:false, isMDSearch: false });

      const fetchDataAsync = async () => {
        const { data: newData } = await detailRefetch(); // refetch 호출 후 응답 대기 
        // log("fetchDataAsync", objState?.MselectedTab, newData);
        const cargo = (newData as string[])[1] ? ((newData as string[])[1] as gridData).data : [];
        const cost = ((newData as string[])[2] as gridData) || {} // grid사용으로 gridData로 맞추기
        // log("cost & cargo : ", cargo, cost)
        const data = {
          ...((newData as string[])[0] as unknown as gridData).data[0],
          cargo : cargo,
          // cost : ((newData as string[])[2] as unknown as gridData).data
          cost : cost
        }
        // log("useEffect detailData", data);
        dispatch({[objState?.MselectedTab]:data})
      };
      fetchDataAsync(); // useEffect 내에서 비동기 호출
    }
  }, [objState?.isMDSearch]);

  useEffect(() => {
    if (initData) {
      if (objState.tab1.length < 1) {
        objState.tab1.push({ cd: "Main", cd_nm: "Main" });
      }
    }
  }, [initData]);

  const onSubmit = (data:any) => {
    log('Submitted data:', data);
  };

  const handleOnClickTab = (code: any) => {
    //tab click event , 작성중인경우, update 한 경우 팝업알림(저장)
    setselectedTab(code);
  };
  const MhandleOnClickTab = (code: any) => {
    // log("MhandleOnClickTab", code)
    if (code.target.id === "Main") {
      dispatch({ MselectedTab: code.target.id });
    } else {
      dispatch({
        MselectedTab: code.target.id,
      });
    }
  };
  const MhandleonClickICON = (code: any) => {
    // log("MhandleonClickICON", code)
    let filtered = objState.tab1.filter((element: any) => {
      return element.cd != code.target.id;
    });
    dispatch({
      tab1: filtered,
      MselectedTab: filtered[filtered.length - 1].cd,
      [code.target.id]: null
      });
  };

  return (
    <TableContext.Provider value={val}>
      <div className={`w-full h-full`}>
          <div>
            <WBMenuTab
              tabList={objState.tab1}
              onClickTab={MhandleOnClickTab}
              onClickICON={MhandleonClickICON}
              MselectedTab={MselectedTab}
            />
          </div>   
            {/* WayBill Main List 화면 */}
            {objState.MselectedTab == "Main" ? (
              <>
                <SearchForm loadItem={initData} />
                <div
                  className={`w-full h-[calc(100vh-210px)] flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}
                >
                  <div className="w-full">
                    <MasterGrid initData={initData} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">       
                    {/* Booking Note Detail 화면 상단{Tab} */}
                    <BKMainTab
                      loadItem={initData}
                      bkData={objState[MselectedTab]}
                      onClickTab={handleOnClickTab}
                    />
                    {/* Booking Note Detail 화면 하단(Sub) */}
                    <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                      <BKMain 
                        loadItem={initData as []} 
                        bkData={objState[MselectedTab]}
                      />
                    </div>
                    <div className={`w-full flex ${selectedTab == "SK" ? "" : "hidden"}`}>
                      <BKSchedule 
                        loadItem={initData} 
                        bkData={objState[MselectedTab]} />
                    </div>
                    <div className={`w-full flex ${selectedTab == "CG" ? "" : "hidden"}`}>
                      <BKCargo 
                        loadItem={initData as []}
                        bkData={objState[MselectedTab]} />
                    </div> 
                    <div className={`w-full flex ${selectedTab == "CT" ? "" : "hidden"}`}>
                      <BKCost 
                        loadItem={initData} 
                        bkData={objState[MselectedTab]} />
                    </div>
                  </form>
                </FormProvider>
              </>
            )}
          
        </div>
    </TableContext.Provider>
  );
}
