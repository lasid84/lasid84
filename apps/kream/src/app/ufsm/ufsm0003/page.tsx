
'use client';

import { SEARCH_MD, TableContext, reducer } from "components/provider/contextObjectProvider";
import { useEffect, useReducer, useMemo, useCallback, memo } from "react";
import SearchForm from "./_component/search-form";
import MasterGrid from './_component/gridMaster';
import { FileUpload } from "components/file-upload";
import { gridData, JsonToGridData, ROW_TYPE, ROW_TYPE_NEW } from "@/components/grid/ag-grid-enterprise";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";

import { log, error } from '@repo/kwe-lib-new';
import InterfaceHistoryGrid from "./_component/gridInterfaceHistory";


export default function UFSM0003() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams : {},
            excel_data : {},
            uploadFile_init: false,
        }
    });
    const { objState } = state;
    const { fr_date, to_date } = objState.searchParams;
    
    const val = useMemo(() => { return { objState, dispatch } }, [state]);

    const methods = useForm({
        // resolver: zodResolver(formSchema),
        defaultValues: {
          fr_date: fr_date || dayjs().format("YYYYMMDD"),
          to_date: to_date || dayjs().format("YYYYMMDD"),
          upload_gubn: "2" //Invoice Confirm
        }
      });
    
      const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        getValues,
        register,
        trigger,
        formState: { errors, isSubmitSuccessful },
      } = methods;
    
    
    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);

    useEffect(()=>{
        // log("objState.uploadFile_init", objState.uploadFile_init)
    }, [objState.uploadFile_init])

    const handleFileDrop = (data : any[]) => {
        const header = data.splice(0,2);
        
        data = data.map(obj => {
            const jsonData:any = {};
            for (const [key, value] of Object.entries(obj)) {
                jsonData[header[0][Number(key)]] = value;
            }
            
            return {
                [ROW_TYPE]:ROW_TYPE_NEW,
                ...jsonData
            }
        })
        var gridData = JsonToGridData(data, header[0], 2);

        log("handleFileDrop", data, header, gridData)
        dispatch({excel_data: gridData});
        // Create.mutate({excel_data:data}, {
        //     onSuccess: (res: any) => {
        //         dispatch({ isMSearch: true });
        //     }
        // });
    };


    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
            <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(() => {})} className="space-y-1">
                        <SearchForm loadItem={null} />
                        <FileUpload onFileDrop={handleFileDrop} isInit={objState.uploadFile_init}/>
                        <div className={`w-full h-[calc(25vh)]`}>
                            <MasterGrid />
                        </div>
                        <div className={`w-full h-[calc(45vh)]`}>
                            <InterfaceHistoryGrid/>
                        </div>
                    </form>
            </FormProvider>
            </div>
        </TableContext.Provider>
    );
}
