
'use client';

import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { SEARCH_MD, TableContext, reducer } from "components/provider/contextObjectProvider";
import { useEffect, useReducer, useMemo, useCallback, memo } from "react";
import { SP_CreateIFData, SP_GetIFData } from "./_component/data";
import SearchForm from "./_component/search-form";
import MasterGrid from './_component/gridMaster';
import { FileUpload } from "components/file-upload";
import { gridData, JsonToGridData, ROW_TYPE, ROW_TYPE_NEW } from "@/components/grid/ag-grid-enterprise";


const { log } = require('@repo/kwe-lib/components/logHelper');


export default function UFSM0003() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams : {},
            excel_data : {},
            uploadFile_init: false,
        }
    });
    const { objState } = state;

    const val = useMemo(() => { return { objState, dispatch } }, [state]);
    
    
    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);

    useEffect(()=>{
        log("objState.uploadFile_init", objState.uploadFile_init)
    }, [objState.uploadFile_init])

    const handleFileDrop = (data : any[], header:string[]) => {
        
        data = data.map(obj => {
            return {
                [ROW_TYPE]:ROW_TYPE_NEW,
                ...obj
            }
        })
        var gridData = JsonToGridData(data, header, 2);
        dispatch({excel_data: gridData});
        // Create.mutate({excel_data:data}, {
        //     onSuccess: (res: any) => {
        //         dispatch({ isMSearch: true });
        //     }
        // });
    };


    return (
        <TableContext.Provider value={val}>
            <SearchForm loadItem={null} />
            <FileUpload onFileDrop={handleFileDrop} isInit={objState.uploadFile_init}/>
            <MasterGrid />
        </TableContext.Provider>
    );
}
