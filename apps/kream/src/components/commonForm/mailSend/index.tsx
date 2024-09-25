
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState, memo } from "react";
import {  SP_GetMailReceiver, SP_SaveData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid, PagePopupGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { LabelGrid } from "components/label";
import { useTranslation } from "react-i18next";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    pgm_code: string
    ref?: any | null
    title?: string
    initData?: any | null
    params: {
        cust_code: string
        pickup_type: string
    }
};

const MailSend: React.FC<Props> = ({ ref = null, title, initData, pgm_code, params }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_SaveData, '');
    // const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    // const [gridOptions, setGridOptions] = useState<GridOption>();
    const [mailform, setMailForm] = useState<any>();

    const { t } = useTranslation();

    // useEffect(() => {
    //     if (initData) {
    //         setMailForm(initData[26]);
    //     }
    //   }, [initData]);


    const { data, refetch, remove } = useGetData({pgm_code: pgm_code}, '', SP_GetMailReceiver, {enabled:false});



    const gridOptions: GridOption = {
        colVisible: { col: ["pgm_code", "seq", "create_date", "create_user"], visible: false },
        gridHeight: "h-full",
        checkbox: ["use_yn"],
        minWidth: { "email": 120 },
        maxWidth : {"use_yn": 80},
        editable: ["email", "remark", "use_yn"],
        // dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno", "remark":"largetext" },
        isAutoFitColData: false,
    };


    useEffect(() => {
        remove();
        refetch();
    }, []);

    useEffect(() => {
        if (objState.isDSearch) {
            refetch();
          dispatch({ isDSearch: false });
        }
      }, [objState.isDSearch]);

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const row = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow)
        // dispatch({ dSelectedRow: selectedRow });
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



    const onSave = useCallback(async () => {
      const api = gridRef.current.api;
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
  
        if (data.__changed) {
            data.pgm_code = pgm_code;
            await Create.mutateAsync(data, {
              onSuccess(data, variables, context) {
                refetch();
              },
            })
            .catch(() => {});
        }
      }
    }, []);
    

    return (
        <>
            <PagePopupGrid
                title={
                    <><LabelGrid id={t(pgm_code)} /></>}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn":true, "def": false })} width='w-15'/>
                        <Button id={"save"} onClick={onSave} width='w-15'/>
                    </>
                }>
                <Grid
                    gridRef={gridRef}
                    listItem={data as gridData}
                    options={gridOptions}
                    event={{
                        onCellValueChanged: handleCellValueChanged,
                        onSelectionChanged: handleSelectionChanged
                    }}
                />
            </PagePopupGrid>
        </>

    );
}

export default MailSend;