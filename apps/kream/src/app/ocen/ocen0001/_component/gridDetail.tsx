
'use client';

import { useEffect, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import {useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import PageSearch from "layouts/search-form/page-search-row";
import { LabelGrid } from "@/components/label"
import { Button } from 'components/button'
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
    cont_type?: any | null;
}

const DetailGrid: React.FC<Props> = ({ initData, cont_type }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData({...objState?.mSelectedRow, cont_type:cont_type}, SEARCH_D, SP_GetDetailData);

    useEffect(() => {
        if (initData) {
            // log(initData[0].data)
            const gridOption: GridOption = {
                colVisible: { col: ["pic_nm", "email", "tel_num","fax_num","remark","use_yn", "def"], visible: true },
                gridHeight: "30vh",
                checkbox: ["use_yn", "def"],
                minWidth: { "email": 200 },
                editable: ["pic_nm", "email", "tel_num","fax_num","remark", "use_yn", "def"],
                dataType: { "create_date": "date" },
                isAutoFitColData: false,
            };
            setGridOptions(gridOption);
        }
    }, [initData])

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
        const modifiedRows: any = [];
        gridRef.current.api.forEachNode((node: any) => {
            var data = { ...node.data };
            log("-------????-----------", data)
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
            // console.log(data);
            if (data.__changed) {
                if (data.carrier_code && data.cont_seq) { //수정
                    Update.mutate(data);
                } else { //신규
                    data.carrier_code = objState.mSelectedRow.carrier_code;
                    Create.mutate(data);
                }
            }
        });
        toastSuccess('Success.');

    };

    return (
        <>
            <PageSearch
                // addition={"border m-1"}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false, "cont_type":cont_type })} />
                        <Button id={"save"} onClick={onSave} />
                    </>
                }>
                <LabelGrid id={cont_type} />
            </PageSearch>
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
        </>

    );
}

export default DetailGrid;