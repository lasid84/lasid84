
'use client';

import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { SEARCH_MD, TableContext, reducer } from "components/provider/contextObjectProvider";
import { useEffect, useReducer, useMemo, useCallback, memo } from "react";
import { SP_CreateIFData, SP_GetIFData } from "./_component/data";
import SearchForm from "./_component/search-form";
import MasterGrid from './_component/gridMaster';
import { FileUpload } from "components/file-upload";


const { log } = require('@repo/kwe-lib/components/logHelper');


export default function UFSM0003() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams : {}
        }
    });
    const { objState } = state;

    const val = useMemo(() => { return { objState, dispatch } }, [state]);
    const { Create } = useUpdateData2(SP_CreateIFData);
    
    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);

    const handleFileDrop = (data : string) => {
        log("handleFileDrop data", data)
        Create.mutate({excel_data:data}, {
            onSuccess: (res: any) => {
                dispatch({ isMSearch: true });
            }
        });
    };


    return (
        <TableContext.Provider value={val}>
            <SearchForm loadItem={null} />
            <FileUpload onFileDrop={handleFileDrop}/>
            <MasterGrid />
        </TableContext.Provider>
    );
}
