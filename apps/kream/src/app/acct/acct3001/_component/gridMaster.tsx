
'use client';

import {useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_GetMasterData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextProvider";
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import Grid, {onRowClicked, onSelectionChanged} from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { useSearchParams } from 'next/navigation'
import { propagateServerField } from "next/dist/server/lib/render-server";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData : any | null;
  };

const MasterGrid: React.FC<Props> = ({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, searchParams, isMSearch } = useAppContext();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetMasterData, {enable:false});
    const gridOption: GridOption = {
        colVisible: { col : ["cust_code", "cust_nm", "bz_reg_no"], visible:true },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        // checkbox: ["no"],
        // editable: ["trans_mode"],
        // dataType: { "create_date" : "date", "vat_rt":"number"},
        // isMultiSelect: false,
        isAutoFitColData: false,
        // alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],
    };
    
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        var data = onRowClicked(param);
        log("handleRowClicked", data)
        // dispatch({isDSearch:true});
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
        const selectedRow = onSelectionChanged(param);
        log("handleSelectionChanged", selectedRow);
        dispatch({mSelectedRow:selectedRow, isDSearch:true});
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isMSearch:false});
        }
    }, [isMSearch]);

    return (
        <Grid
            gridRef={gridRef}
            loadItem={initData}
            listItem={mainData as gridData}
            options={gridOption}
            event={{
                onRowClicked: handleRowClicked,
                onSelectionChanged: handleSelectionChanged,
            }}
        />
            
    );
}

export default MasterGrid;