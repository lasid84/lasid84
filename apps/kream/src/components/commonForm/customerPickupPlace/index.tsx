
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState, memo } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, RowNode, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { LabelGrid } from "components/label";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    ref?: any | null
    initData?: any | null
    params: {
        cust_code: string
        pickup_type: string
    }
};

const CustPickupPlace: React.FC<Props> = ({ ref = null, initData, params }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    // const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data, refetch, remove } = useGetData({...params}, SEARCH_D, SP_GetDetailData);

    const gridOptions: GridOption = {
        colVisible: { col: ["cust_code", "pickup_seq", "fax_num", "create_date", "create_user"], visible: false },
        gridHeight: "h-full",
        checkbox: ["use_yn", "def"],
        minWidth: { "pickup_nm": 170, "addr": 230, "email": 80, "use_yn": 20, "def": 20 },
        // maxWidth : {"use_yn": 80, "def": 80  },
        editable: ["pickup_nm", "addr", "pic_nm", "email", "tel_num", "fax_num", "def", "remark", "use_yn"],
        dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno", "remark":"largetext" },
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
        // log("detail selectionchange1", objState.mSelectedRow, objState.isMSearch);
        // const row = onRowClicked(param);
        // var selectedRow = {"colId": param.node.id, ...param.node.data}
        // dispatch({dSelectedRow:selectedRow});
    };

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        // log("handleCellValueChanged");
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

    // const onSave = () => {
    //     var hasData = false;
    //     gridRef.current.api.forEachNode((node: any) => {
    //         var data = node.data;
    //         gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
    //         if (data.__changed) {
    //             hasData = true;
    //             if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
    //                 data.cust_code = params.cust_code;
    //                 data.pickup_type = params.pickup_type;
    //                 Create.mutate(data);
    //             } else { //수정
    //                 Update.mutate(data);
    //             }
    //         }
    //     });
    //     // log("onSave", gridRef.current.api, modifiedRows);
    //     if (hasData) {
    //         toastSuccess('Success.');
    //     }
    // };

    const onSave = () => {
        const processNodes = async () => {
          const api = gridRef.current.api;
          const nodes: RowNode[] = [];
                      
          api.forEachNode((node: RowNode) => {
            nodes.push(node);
          });
          for (const node of nodes) {
            var data = node.data;
            log("onSave data", node.data);
            gridOptions?.checkbox?.forEach((col) => {
              data[col] = data[col] ? "Y" : "N";
            });
            if (data.__changed) {
              try {
                if (data.__ROWTYPE === ROW_TYPE_NEW) {
                    data.cust_code = params.cust_code;
                    data.pickup_type = params.pickup_type;
                  await Create.mutateAsync(data);
                } else {
                  await Update.mutateAsync(data);
                }
              } catch (err) {
                error("error:", err);
              } finally {
                data.__changed = false;
              }
            }
          }
        };
        processNodes()
          .then(() => {
            toastSuccess("Success.");
            dispatch({ isDSearch: true });
          })
          .catch((err) => {
            error("node. Error", err);
          });
      };
    

    return (
        <>
            <PageGrid
                title={
                    <><LabelGrid id={'pickup'} /></>}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn":true, "def": false })} width='w-15'/>
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

export default CustPickupPlace;