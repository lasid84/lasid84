
'use client';

import { useEffect, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { LabelGrid } from "@/components/label"
import { Button } from 'components/button'
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";import { toastSuccess } from "components/toast"

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
    cont_type?: any | null;
}

const DetailGrid: React.FC<Props> = ({ cont_type }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData({ ...objState?.mSelectedRow, cont_type: cont_type }, SEARCH_D, SP_GetDetailData);

    useEffect(() => {
        if (true) {
            // log(initData[0].data)
            const gridOption: GridOption = {
                colVisible: { col: ["pic_nm", "email", "tel_num", "fax_num", "remark", "use_yn", "def"], visible: true },
                gridHeight: "h-full",
                checkbox: ["use_yn", "def"],
                minWidth: { "email": 200 },
                editable: ["pic_nm", "email", "tel_num", "fax_num", "remark", "use_yn", "def"],
                dataType: { "create_date": "date" },
                isAutoFitColData: false,
            };
            setGridOptions(gridOption);
        }
    }, [])

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
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
        log("===================", objState.mSelectedRow, objState.isMSearch, objState.dSelectedRow);
        var hasData = false
        gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
            log("===onSave")
            if (data.__changed) {
                hasData = true;
                if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                    data.carrier_code = objState.mSelectedRow.carrier_code;
                    Create.mutate(data);
                }
                else { //수정
                    Update.mutate(data);
                }
            }
        });
        if (hasData) toastSuccess('Success.');

    };

    return (
        <>
            <PageGrid
                title={<><LabelGrid id={cont_type} /></>}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false, "cont_type": cont_type })} />
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
                    }}/>
            </PageGrid>
        </>
    );
}

export default DetailGrid;