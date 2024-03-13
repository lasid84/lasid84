
'use client';

import {useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import Grid, { isFirstColumn, getFirstColumn, onGridRowAdd, onCellValueChanged, onSelectionChanged } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import PageSearch from "layouts/search-form/page-search-row";

import { TButtonBlue } from "components/form";
import { CellValueChangedEvent, IRowNode, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData? : any | null;
  };

const DetailGrid: React.FC<Props> = ({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, mSelectedRow, isDSearch } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [ gridOptions, setGridOptions] = useState<GridOption>();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(mSelectedRow, SEARCH_D, SP_GetDetailData, {enable:false});

    useEffect(() => {
        if (isDSearch) {
            mainRefetch();
            dispatch({isDSearch:false});
        }
    }, [isDSearch]);

    useEffect(() => {
        if (initData) {
            log(initData[0].data)
            const gridOption: GridOption = {
                colVisible: { col : ["cust_code", "cont_seq", "fax_num"], visible:false },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                checkbox: ["use_yn", "def"],
                select: {"user_dept" : initData[0].data.map((row:any) => row['user_dept'])},
                // editable: ["trans_mode"],
                // dataType: { "create_date" : "date", "vat_rt":"number"},
                // isMultiSelect: false,
                // isAutoFitCol: true,
                // alignLeft: ["major_category", "bill_gr1_nm"],
                // alignRight: [],
            };

            setGridOptions(gridOption);
        }
    }, [initData])
    
    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
        const selectedRow = onSelectionChanged(param);
        dispatch({dSelectedRow:{...selectedRow}});
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    const handleCellValueChanged = useCallback((param:CellValueChangedEvent) => {
        const val = onCellValueChanged(param);
        gridRef.current.api.forEachNode((node:IRowNode, i:number) => {
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
          })
    },[]);

    const onSave = () => {        
        const modifiedRows:any = [];
        gridRef.current.api.forEachNode((node:any) => {
            var data = node.data;
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col]? 'Y' : 'N');
            
            if (data.__changed) {
              if (data.cust_code && data.cont_seq) { //수정
                Update.mutate(data);
              } else { //신규
                data.cust_code = mSelectedRow.cust_code;
                Create.mutate(data);
              }
            }
          });
        log("onSave", gridRef.current.api, modifiedRows);
    };

    return (
        <>
            <PageSearch
                right={
                <>
                <TButtonBlue label={"add"} onClick={() => onGridRowAdd(gridRef.current)} />
                <TButtonBlue label={"save"} onClick={onSave} />
                </>
            }>
                <></>
            </PageSearch>
            <Grid
                gridRef={gridRef}
                loadItem={initData}
                listItem={mainData as gridData}
                options={gridOptions}
                event={{
                    onSelectionChanged: handleSelectionChanged,
                    onCellValueChanged: handleCellValueChanged
                }}
                />
        </>
            
    );
}

export default DetailGrid;