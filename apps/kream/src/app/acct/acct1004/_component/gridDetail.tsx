
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { isFirstColumn, getFirstColumn } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { TButtonBlue } from "components/form";
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import {toastSuccess} from "components/toast"
import { Anonymous_Pro } from "next/font/google";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const DetailGrid: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData(objState?.mSelectedRow, SEARCH_D, SP_GetDetailData, { enabled: true });

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
                colVisible: {
                    col: ["invoice_no", "vat_rt", "fe_ref_item", "uas_gl_code", "vat_yn", "fins_yn", "rem_prt_yn", "fe_prt_yn"
                        , "gl_code", "bill_yn"], visible: false
                },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                minWidth: {"charge_desc":180},
                maxWidth: {invoice_seq:80},
                gridHeight: "h-full",
                // editable: ["trans_mode"],
                dataType: { "create_date": "date", "bz_reg_no": "bizno", 
                    "invoice_amt":"number", "local_amt":"number" , "vat_rt": "number",
                    "vat_amt":"number", "actual_cost":"number", "cost_exchg_rt":"number", 
                    "waybill_amt":"number", "waybill_exchg_rt":"number", 
                },
                total: {
                    invoice_seq:"count", invoice_amt:"sum", local_amt:"sum", waybill_amt:"sum"
                },
                // isAutoFitColData: true,
                isShowRowNo:false
            };

            setGridOptions(gridOption);
        }
    }, [initData])

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        const selectedRow = param.api.getSelectedRows()[0];
        dispatch({ dSelectedRow: selectedRow });

    };

    const handleRowClicked = (param: RowClickedEvent) => {
        log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        const selectedRow = param.api.getSelectedRows()[0];
        dispatch({ dSelectedRow: selectedRow });
    };

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        log("handleCellValueChanged");
        gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
        })
    };

    const onSave = () => {
        // log("===================", objState.mSelectedRow, objState.isMSearch, objState.dSelectedRow);
        const modifiedRows: any = [];
        gridRef.current.api.forEachNode((node: any) => {
            var data = { ...node.data };
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
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
            <div className="h-full space-y-1">
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
            </div>

        </>

    );
}

export default DetailGrid;