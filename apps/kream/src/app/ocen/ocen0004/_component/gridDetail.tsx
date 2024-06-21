
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { Anonymous_Pro } from "next/font/google";
import { LabelGrid } from "@/components/label";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const DetailGrid: React.FC<Props> = () => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData(objState?.mSelectedRow, SEARCH_D, SP_GetDetailData);

    useEffect(() => {
            // log(initData[0].data)
            const gridOption: GridOption = {
                colVisible: { col: ["place_code", "cont_seq", "create_date", "create_user"], visible: false },
                gridHeight: "h-full",
                checkbox: ["use_yn", "def"],
                minWidth: { "pic_nm": 100, "addr": 230, "email": 80, "use_yn": 30, "def": 30 },
                editable: ["pic_nm", "addr", "email", "tel_num", "fax_num", "def", "remark", "use_yn"],
                dataType: { "create_date": "date" },
                isAutoFitColData: false,
            };
            setGridOptions(gridOption);
    }, [])

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const row = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
        dispatch({ dSelectedRow: selectedRow });
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    const handleRowClicked = (param: RowClickedEvent) => {
        log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        // const row = onRowClicked(param);
        // var selectedRow = {"colId": param.node.id, ...param.node.data}
        // dispatch({dSelectedRow:selectedRow});
    };

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        log("handleCellValueChanged");
        gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            log("handleCellValueChanged2", param.node.data);
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
                // node.setDataValue('__change', true);
            }
        });
    };

    const onSave = () => {
        var hasData = false;
        gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
            if (data.__changed) {
                hasData = true;
                if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                    data.place_code = objState.mSelectedRow.place_code;
                    // data.pickup_type = 'OE';
                    Create.mutate(data);
                } else { //수정
                    Update.mutate(data);
                }
            }
        });
        // log("onSave", gridRef.current.api, modifiedRows);
        if (hasData) {
            toastSuccess('Success.');
            detailRefetch();
        }

    };

    return (
        <>
            <PageGrid
                title={<LabelGrid id={'contact_nm'} />}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false })} />
                        <Button id={"save"} onClick={onSave} />
                    </>
                }>
                <Grid
                    gridRef={gridRef}
                    listItem={detailData as gridData}
                    options={gridOptions}
                    event={{
                        onCellValueChanged: handleCellValueChanged,
                        onSelectionChanged: handleSelectionChanged
                    }}
                />
            </PageGrid>
        </>

    );
}

export default DetailGrid;