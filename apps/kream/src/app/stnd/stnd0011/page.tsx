
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import DetailGrid from './_component/gridDetail';
import DetailInfo from './_component/DetailInfo';
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { getMenuParameters } = require('@repo/kwe-lib/components/menuParameterHelper.js');


export default function STND0011() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            isIFPopUpOpen: false,
            mSelectedRow: {},
            dSelectedRow: {},
            cont_type: '',
            gridRef_m: useRef<any | null>(null)
        }
    });
    const { objState } = state;
    const { searchParams, isMSearch } = objState;
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

    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    useEffect(() => {
        const params = getMenuParameters(menu_param);
        dispatch({ cont_type: params.cont_type });
    }, [menu_param])

    return (
        <TableContext.Provider value={val}>
            <FormProvider {...methods}>
                <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
                    <div className={`w-full h-full`}>
                        <SearchForm  />
                        <div className="grid w-full h-[calc(50vh)] grid-cols-3">
                            <MasterGrid  />
                            <div className="grid col-span-2 grid-rows-3 h-300 ">
                                <div className="row-span-2"><DetailInfo /></div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </TableContext.Provider>
    );
}
