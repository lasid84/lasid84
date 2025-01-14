
'use client';

import {useEffect, useCallback, useRef, memo, useState, } from "react";
import { SP_GetIFData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    initData? : any | null;
  };

const MasterGrid: React.FC<Props> = memo(() => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch, excel_data } = objState;
    const [ mData, setMData] = useState<gridData>();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetIFData, {enabled:false});
    const gridOption: GridOption = {
        colVisible: { col : ["uuid", "record_id", "sort_id", "print_ind", "type"], visible:false },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        gridHeight: "h-full",
        // checkbox: ["no"],
        // editable: ["trans_mode"],
        dataType: { "create_date" : "date", "complete_date" : "date", "invoice_wb_amt": "number", "invoice_charge_amt" : "number", "actual_cost_amt" : "number"},
        // isMultiSelect: false,
        isAutoFitColData: true,
        alignLeft: [""],
    };
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        // log("handleRowClicked", selectedRow);
        // dispatch({mSelectedRow:selectedRow });
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
    }, []);

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isMSearch:false, uploadFile_init:false});
            setMData(mainData as gridData);
            // log("MasterGrid", mainData)
        }
    }, [isMSearch]);

    useEffect(() => {
        setMData(mainData as gridData);
    }, [mainData])

    useEffect(() => {
        // log("excel_data", excel_data);
        if (Object.keys(excel_data).length) setMData(excel_data);
    }, [excel_data]);

    return (
        <Grid
            id="gridMaster"
            gridRef={gridRef}
            // loadItem={initData}
            listItem={mData}
            options={gridOption}
            event={{
                onRowClicked: handleRowClicked,
                onSelectionChanged: handleSelectionChanged,
            }}
        />
    );
});

export default MasterGrid;