
'use client';

import { useEffect, useRef, memo } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { PageMGrid2, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from 'components/button';
import { LabelGrid } from "components/label";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    // const { data: mainDetailData } = useGetData(objState?.mSelectedRow, SEARCH_MD, SP_GetDetailData, { enabled: true });


    const gridOption: GridOption = {
        colVisible: { col: ["trans_mode", "trans_type", "orig_department_id", "orig_agent_id", "b_agent_id", "create_user", "update_date", "update_user"], visible: false },
        gridHeight: "h-[calc(100vh-200px)]",
        minWidth: { "waybill_no": 150, "shipment_status": 40 },
        dataType: {
            "executed_on_date": "date", "accounting_date": "date", "imp_actg_intrfc_status_date": "date", "create_date": "date",
            "bk_dd": "date", "etd": "date", "eta": "date", "final_eta": "date", "doc_close_dd": "date", "cargo_close_dd": "date", "pickup_dd": "date",
            "volume": "number", "gross_weight": "number", "volume_weight": "number", "chargeable_weight": "number",
        },
        isAutoFitColData: true,
        refRow: objState.refRow
    };


    const handleRowClicked = async (param: RowClickedEvent) => {
        // var selectedRow = { "colId": param.node.id, ...param.node.data }
        // if (objState.tab1) {
        //     if (objState.tab1.findIndex((element: any) => {
        //         if (element.cd === selectedRow.bk_id) { return true }
        //     }) !== -1) {
        //         dispatch({ MselectedTab: selectedRow.bk_id })
        //     } else {
        //         objState.tab1.push({ cd: selectedRow.bk_id, cd_nm: selectedRow.bk_id })
        //         dispatch({ MselectedTab: selectedRow.bk_id })
        //     }
        // }
        // dispatch({ isMDSearch: true, mSelectedRow: selectedRow });
    };

    const handleRowDoubleClicked = (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            if (objState.tab1.findIndex((element: any) => {
                if (element.cd === selectedRow.bk_id) { return true }
            }) !== -1) {
                dispatch({ MselectedTab: selectedRow.bk_id })
            } else {
                objState.tab1.push({ cd: selectedRow.bk_id, cd_nm: selectedRow.bk_id })
                dispatch({ MselectedTab: selectedRow.bk_id })
            }
        }
        dispatch({ isMDSearch: true, mSelectedRow: selectedRow });
    }

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
        console.log('handleSelectionChanged2', gridRef.current.api.getFirstDisplayedRowIndex())
        dispatch({ refRow: gridRef.current.api.getFirstDisplayedRowIndex() })
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);


    return (
        <>
            <PageMGrid2
                title={<> </>}
                right={
                    <>
                        <ICONButton id="alarm" disabled={false} size={'24'} />
                        <Button id={"new"} width="w-40" />
                    </>
                }>
                <Grid
                    gridRef={gridRef}
                    loadItem={initData}
                    listItem={mainData as gridData}
                    options={gridOption}
                    event={{
                        onRowDoubleClicked: handleRowDoubleClicked,
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                    }}
                />
            </PageMGrid2>
        </>
    );
});

export default MasterGrid;