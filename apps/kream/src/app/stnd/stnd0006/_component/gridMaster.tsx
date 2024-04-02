
'use client';

import {useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { SP_GetData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, {onRowClicked, onSelectionChanged, autoSizeAll} from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { useSearchParams } from 'next/navigation'
import { propagateServerField } from "next/dist/server/lib/render-server";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Modal from "./popup";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData? : any | null;
  };

const MasterGrid: React.FC<Props> = ({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch } = objState;

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetData, {enabled:false});
    const gridOption: GridOption = {
        colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:true },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        checkbox: ["no"],
        editable: ["trans_mode"],
        dataType: { "create_date" : "date", "vat_rt":"number"},
        isMultiSelect: false,
        isAutoFitColData: true,
        alignLeft: ["major_category", "bill_gr1_nm"],
        alignRight: [],
        // rowadd
        // rowdelete

    };
    
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        var data = onRowClicked(param);
        log("handleRowClicked", data)
        dispatch({isPopUpOpen:true, crudType:crudType.UPDATE});
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
        const selectedRow = onSelectionChanged(param);
        log("handleSelectionChanged", selectedRow);
        dispatch({mSelectedRow:selectedRow});
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    useEffect(() => {
        if (isMSearch && gridRef) {
            log("gridMaster", searchParams)
            mainRefetch();
            dispatch({isMSearch:false});
            // autoSizeAll(gridRef.current);
        }
    }, [isMSearch, gridRef]);

    return (
        <>
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
            <Modal
                loadItem={initData}
            />
        </>
            
    );
}

export default MasterGrid;