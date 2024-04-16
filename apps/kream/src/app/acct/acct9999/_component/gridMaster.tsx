
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_GetMasterData, SP_GetDetailData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D, SEARCH_MD } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null;
};

const MasterGrid: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enable: false });
    const { data: mainDetailData } = useGetData(objState?.mSelectedRow, SEARCH_MD, SP_GetDetailData, { enable: true });


    const gridOption: GridOption = {
        colVisible: { col: ["waybill_no", "shipment_status", "status", "trans_mode", "trans_type","orig_terminal_id","dest_terminal_id","execution_date"], visible: true },
        gridHeight: "80vh",
        minWidth: { "waybill_no": 150, "shipment_status": 40 },
        isAutoFitColData: false,
    };

    function findIndex(element: any) {
        if (element.cd === objState.mSelectedRow.waybill_no) {
            return true
        }
    }

    const handleRowClicked = async (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        log("handleRowClicked", selectedRow)
        if (objState.tab1) {
            //console.log('검증', objState.tab1.findIndex(findIndex))
            if (objState.tab1.findIndex(findIndex) !== -1) {
                dispatch({ MselectedTab: selectedRow.waybill_no })
            } else {objState.tab1.push({ cd: selectedRow.waybill_no, cd_nm: selectedRow.waybill_no })}
        }
        dispatch({ isMDSearch: true, mSelectedRow: selectedRow });
    };

    useEffect(() => {
        if (objState.tab1) {
            //objState.tab1.push({ cd: 'Main', cd_nm: 'Main' })
        }
    }, [objState.tab1])


    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (objState.isMDSearch) {
            //mainRefetch();
            //log("maindetailisSearch", objState.isMDSearch);
            dispatch({ isMDSearch: false });
            //log("mSelectedDetail", objState.mSelectedDetail)
        }
    }, [objState?.isMDSearch]);

    useEffect(() => {
        if (mainDetailData) {
            log('mainDetailDataaaaaa',mainDetailData)
            dispatch({ mSelectedDetail: mainDetailData.data[0] })
        }
    }, [mainDetailData]);

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