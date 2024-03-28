
'use client';

import {useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { isFirstColumn, getFirstColumn, onGridRowAdd, onCellValueChanged, onSelectionChanged, onRowClicked } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import PageSearch from "layouts/search-form/page-search-row";

import { TButtonBlue } from "components/form";
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "@/page-parts/tmpl/toast";
import { Anonymous_Pro } from "next/font/google";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData? : any | null;
  };

const DetailGrid: React.FC<Props> = ({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [ gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData(objState?.mSelectedRow, SEARCH_D, SP_GetDetailData, {enable:false});

    /* state 변경 시 useQuery 등록한 데이터 모두 콜 하는듯... */
    // useEffect(() => {
    //     if (objState.isDSearch) {
    //         console.log("Detail useEffect", objState.isDSearch)
    //         detailRefetch();
    //         dispatch({isDSearch:false});
    //     }
    // }, [objState.mSelectedRow, objState.isDSearch]);

    useEffect(() => {
        if (initData) {
            // log(initData[0].data)
            const gridOption: GridOption = {
                colVisible: { col : [ "invoice_no", "vat_rt", "fe_ref_item", "uas_gl_code", "vat_yn", "fins_yn", "rem_prt_yn", "fe_prt_yn"
                , "gl_code", "bill_yn"], visible:false },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                gridHeight: "33vh",
                checkbox: ["use_yn", "def"],
                // select: { "user_dept" : initData[0].data.map((row:any) => row['user_dept'])},
                minWidth: {"email": 200},
                // editable: ["trans_mode"],
                dataType: { "create_date" : "date", "vat_rt":"number", "bz_reg_no":"bizno"},
                // isMultiSelect: false,
                isAutoFitColData: true,
                // alignLeft: ["major_category", "bill_gr1_nm"],
                // alignRight: [],
            };

            setGridOptions(gridOption);
        }
    }, [initData])
    
    const handleSelectionChanged = (param:SelectionChangedEvent) => {
        log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        const row = onSelectionChanged(param);
        // var newRow:any = [];
        // newRow[1] = row;
        // log("detail selectionchange2", newRow);
        dispatch({dSelectedRow:row});
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    const handleRowClicked = (param:RowClickedEvent) => {
        log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        const row = onRowClicked(param);
        dispatch({dSelectedRow:row});
    };

    const handleCellValueChanged = (param:CellValueChangedEvent) => {
        log("handleCellValueChanged");
        onCellValueChanged(param);
        gridRef.current.api.forEachNode((node:IRowNode, i:number) => {
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
          })
        };

    const onSave = () => {        
        log("===================", objState.mSelectedRow, objState.isMSearch, objState.dSelectedRow);
        const modifiedRows:any = [];
        gridRef.current.api.forEachNode((node:any) => {
            var data = {...node.data};
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col]? 'Y' : 'N');
            // console.log(data);
            if (data.__changed) {
              if (data.cust_code && data.cont_seq) { //수정
                Update.mutate(data);
              } else { //신규
                data.cust_code = objState.mSelectedRow.cust_code;
                Create.mutate(data);
              }
            }
          });
        // log("onSave", gridRef.current.api, modifiedRows);
        toastSuccess('Success.');

    };

    return (
        <>
            <PageSearch
                right={
                <>
                {/* <TButtonBlue label={"add"} onClick={() => onGridRowAdd(gridRef.current, {"use_yn": true, "def":false})} />
                <TButtonBlue label={"save"} onClick={onSave} /> */}
                </>
            }>
                <></>
            </PageSearch>
            <Grid
                gridRef={gridRef}
                loadItem={initData}
                listItem={detailData as gridData}
                options={gridOptions}
                event={{
                    onCellValueChanged: handleCellValueChanged,
                    onSelectionChanged: handleSelectionChanged
                }}
                />
        </>
            
    );
}

export default DetailGrid;