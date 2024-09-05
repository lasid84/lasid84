
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_Load } from "@/app/stnd/stnd0008/_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import { FormProvider, useForm } from "react-hook-form";
import PopUpInterFace from "components/ufs-interface/popupInterface";
import { SCRAP_UFSP_PROFILE_CUSTOMER } from "@/components/ufs-interface/_component/data";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { getMenuParameters } = require('@repo/kwe-lib/components/menuParameterHelper.js');


export default function STND0012() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isPopUpOpen:false,
            popType:null,
            isIFPopUpOpen: false,
            gridRef_m: useRef<any | null>(null)
        }
    });
    const { objState } = state;
    const { searchParams, gridRef_m } = objState;
    const val = useMemo(() => { return { dispatch, objState } }, [state]);

    const methods = useForm({
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

    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <FormProvider {...methods}>
                <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
                    <SearchForm  />
                    <MasterGrid  initData={initData}/>
                    <PopUpInterFace pgm_code={SCRAP_UFSP_PROFILE_CUSTOMER}/>
                </form>
            </FormProvider>
        </TableContext.Provider>
    );
}
