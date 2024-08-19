
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetCYContactData, SP_InsertCYCont, SP_UpdateCYCont } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
// import { LabelGrid } from "components/label";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    ref?: any | null
    initData?: any | null
    params: {
        place_code: string
        cont_type: string
    }
};

const CustCont: React.FC<Props> = ({ ref = null, initData, params }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertCYCont, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateCYCont, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data, refetch, remove } = useGetData({...params}, SEARCH_D, SP_GetCYContactData);

    useEffect(() => {
        // let arrDept = [];
        // if (initData) {
        //     arrDept = initData[0]?.data.map((row: any) => row['user_dept'])
        // }
        
        const gridOption: GridOption = {
            colVisible: { col: ["place_code", "cont_seq", "cont_type", "create_date", "create_user"], visible: false },
            gridHeight: "h-full",
            checkbox: ["use_yn", "def"],
            minWidth: { "pic_nm": 100, "email": 80, "use_yn": 30, "def": 30 },
            maxWidth : {"use_yn": 90, "def":90},
            editable: ["pic_nm",  "email", "tel_num", "fax_num", "remark", "def", "use_yn"],
            dataType: { "create_date": "date" },
            isAutoFitColData: false,
        };

        setGridOptions(gridOption);
        
    }, [initData])

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
        // log("handleCellValueChanged");
        gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            log("handleCellValueChanged2", param.column.getColId(), node.id, param.node.id, node.id === param.node.id, node.data.def, param.data.def);
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
        });
    };

    // const onSave = () => {
    //     var hasData = false;
    //     gridRef.current.api.forEachNode((node: any) => {
    //         var data = node.data;
    //         // gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
    //         if (gridOptions?.checkbox) {
    //             for (let i = 0; i < gridOptions?.checkbox?.length; i++) {
    //                 let col = gridOptions?.checkbox[i];
    //                 data[col] = data[col] ? 'Y' : 'N';
    //             }
    //         }
    //         data.cont_type = objState.cont_type;
    //         if (data.__changed) {
    //             hasData = true;
    //             if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
    //                 data.place_code = params.place_code;
    //                 data.cont_type = params.cont_type;
    //                 Create.mutate(data);
    //             } else { //수정
    //                 Update.mutate(data);
    //             }
    //         }
    //     });
    //     // log("onSave", gridRef.current.api, modifiedRows);
    //     if (hasData) {
    //         // dispatch({ dSelectedRow: {...objState?.mSelectedRow} });
    //         toastSuccess('Success.');
    //     }

    // };

    const onSave = () => {
        const processNodes = async () => {
          const api = gridRef.current.api;
          for (const node of api.getRenderedNodes()) {
            var data = node.data;
            gridOptions?.checkbox?.forEach((col) => {
              data[col] = data[col] ? "Y" : "N";
            });
            if (data.__changed) {
              try {
                if (data.__ROWTYPE === ROW_TYPE_NEW) {
                    data.place_code = params.place_code;
                    data.cont_type = params.cont_type;
                  await Create.mutateAsync(data);
                } else {
                  await Update.mutateAsync(data);
                }
              } catch (error) {
                log.error("error:", error);
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
          .catch((error) => {
            log.error("node. Error", error);
          });
      };

    return (
        <>
            <PageGrid
                // title={
                //     <><LabelGrid id={'pic_nm'} /></>}
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false, cont_type: params.cont_type })} width='w-15'/>
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
            </PageGrid>
        </>

    );
}

export default CustCont;