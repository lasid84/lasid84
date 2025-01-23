
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState, memo } from "react";
import {  SP_GetMailReceiver, SP_SaveData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, RowNode, SelectionChangedEvent } from "ag-grid-community";
import { useFormContext } from "react-hook-form";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  pgm_code: string
  cust_code?: string
  title?: string
  ref?: any | null
  initData?: any | null
};

const MailReceiver: React.FC<Props> = ({ ref = null, initData, pgm_code, cust_code, title }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { getValues } = useFormContext();
    const { Create } = useUpdateData2(SP_SaveData, '');
    // const [gridOptions, setGridOptions] = useState<GridOption>();

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

    // useEffect(() => {
    //     if (true) {
    //         // log(initData[0].data)
            
    //         const gridOption: GridOption = {
    //             colVisible: { col: ["cust_code", "pickup_seq", "fax_num", "create_date", "create_user"], visible: false },
    //             gridHeight: "h-full",
    //             checkbox: ["use_yn", "def"],
    //             minWidth: { "pickup_nm": 170, "addr": 230, "email": 80, "use_yn": 30, "def": 30 },
    //             // maxWidth : {"use_yn": 80, "def": 80  },
    //             editable: ["pickup_nm", "addr", "pic_nm", "email", "tel_num", "fax_num", "def", "remark", "use_yn"],
    //             dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno" },
    //             isAutoFitColData: false,
    //         };

    //         setGridOptions(gridOption);
    //     }
    // }, [])

    useEffect(() => {
        remove();
        refetch();
    }, []);

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const row = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow)
        // dispatch({ dSelectedRow: selectedRow });
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    const handleRowClicked = (param: RowClickedEvent) => {
        // const row = onRowClicked(param);
        // var selectedRow = {"colId": param.node.id, ...param.node.data}
        // dispatch({dSelectedRow:selectedRow});
    };

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            // log("handleCellValueChanged2", param.node.data);
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
    const nodes: RowNode[] = [];
                
    api.forEachNode((node: RowNode) => {
      nodes.push(node);
    });
    for (const node of nodes) {
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
        <PageGrid
            title={title}
            right={
                <>
                    <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn":true })} width='w-15'/>
                    <Button id={"save"} onClick={onSave} width='w-15'/>
                </>
            }>
            <Grid
                id="index"
                gridRef={gridRef}
                listItem={data as gridData}
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

export default MailReceiver;