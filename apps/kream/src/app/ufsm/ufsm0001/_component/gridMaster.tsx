
'use client';

import { useEffect, useRef } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
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
    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });

    const gridOption: GridOption = {
        colVisible: { col: ["pipeline_tx_id", "mwb_status", "orig_department_id", "orig_agent_id", "b_agent_id", "create_user", "update_date", "update_user"], visible: false },
        gridHeight: "70vh",
        minWidth: { "waybill_no": 150, "shipment_status": 40 },
        dataType: { "execution_date": "date", "ic_dc_consol_date": "date", "eta_date": "date", "total_volume":'number',"total_actual_weight":'number',"total_volume_weight":'number','total_chargeable_weight':'number' },
        isAutoFitColData: true,
        refRow : objState.refRow
    };


    const handleRowClicked = async (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            if (objState.tab1.findIndex((element: any) => {
                if (element.cd === selectedRow.waybill_no) { return true }
            }) !== -1) {
                dispatch({MselectedTab: selectedRow.waybill_no })
            } else {
                objState.tab1.push({ cd: selectedRow.waybill_no, cd_nm: selectedRow.waybill_no })
                dispatch({MselectedTab: selectedRow.waybill_no })
            }
        }

        dispatch({isMDSearch: true, mSelectedRow: selectedRow })
    }

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0]
        log("handleSelectionChanged", selectedRow)
        dispatch({ refRow: gridRef.current.api.getFirstDisplayedRowIndex() })
    }

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (objState.isMDSearch) {
            dispatch({ isMDSearch: false });
        }
    }, [objState?.isMDSearch]);

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