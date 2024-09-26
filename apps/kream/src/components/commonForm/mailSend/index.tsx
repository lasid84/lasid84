
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState, memo } from "react";
import {  SP_GetMailReceiver, SP_SaveData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid, PagePopupGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { LabelGrid } from "components/label";
import {
    TRANPOSRT_EMAIL_LIST_OE, CUSTOMER_EMAIL_LIST_OE,
  } from "components/commonForm/mailReceiver/_component/data";
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

const MailSend: React.FC<Props> = ({ ref = null, pgm_code, params }) => {

    const { t } = useTranslation();
    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_SaveData, '');
    const { data, refetch, remove } = useGetData({pgm_code: pgm_code, cust_code:params.cust_code}, '', SP_GetMailReceiver, {enabled:false});


    const gridOptions: GridOption = {
        colVisible: { col: ["pgm_code", "seq", "create_date", "create_user"], visible: false },
        gridHeight: "h-full",
        checkbox: ["use_yn"],
        minWidth: { "email": 120 },
        maxWidth : {"use_yn": 80},
        editable: ["email", "remark", "use_yn"],
        isAutoFitColData: false,
    };

    // pgm_code 기본 값으로 초기화
    // const [PgmCode, setPgmCode] = useState<string>(TRANPOSRT_EMAIL_LIST_OE);

    // 부모에서 받은 pgm_code가 변경될 때 로컬 상태를 업데이트
    // useEffect(() => {
    //     if (pgm_code) {
    //     setPgmCode(pgm_code);
    //     }
    // }, [pgm_code]);

    useEffect(() => {
        remove();
        refetch();
    }, []);

    useEffect(() => {
        if (params.cust_code) {
        refetch();
        }
    }, [params, refetch]);

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
            data.cust_code = params.cust_code;
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