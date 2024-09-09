
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageGrid } from "layouts/grid/grid";
import { Button } from 'components/button';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { LabelGrid } from "components/label";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    ref?: any | null
    initData?: any | null
    params: {
        cust_code: string
        cont_type: string
    }
};

const ChargeCode: React.FC<Props> = ({ ref = null, initData, params }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data, refetch, remove } = useGetData({...params}, SEARCH_D, SP_GetDetailData);

    useEffect(() => {
        let arrDept = [];
        if (initData) {
            arrDept = initData[0]?.data.map((row: any) => row['user_dept'])
        }
        // log(initData[0].data)
        const gridOption: GridOption = {
            colVisible: { col: ["cust_code", "cont_seq", "cont_type"], visible: false },
            // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
            gridHeight: "h-full",
            checkbox: ["use_yn", "def"],
            select: { "user_dept": arrDept },
            minWidth: { "email": 200 },
            editable: ["pic_nm", "email", "cust_office", "tel_num", "fax_num", "user_dept", "bz_plc_cd", "use_yn", "def"],
            dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno" },
            // isMultiSelect: false,
            isAutoFitColData: false,
            // alignLeft: ["major_category", "bill_gr1_nm"],
            // alignRight: [],
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
        // const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow)
        // dispatch({ dSelectedRow: selectedRow });
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    const handleRowClicked = (param: RowClickedEvent) => {
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

    // const onSave = () => {
    //     // log("===================params", params);
    //     var hasData = false
    //     gridRef.current.api.forEachNode((node: any) => {
    //         var data = node.data;
    //         gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
    //         if (data.__changed) {
    //             hasData = true;
    //             if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
    //                 data.cust_code = params.cust_code;
    //                 data.cont_type = params.cont_type
    //                 Create.mutate(data);
    //             } else { //수정
    //                 Update.mutate(data);
    //             }
    //         }
    //     });
    //     // log("onSave", gridRef.current.api, modifiedRows);
    //     if (hasData) toastSuccess('Success.');

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
                    data.cust_code = params.cust_code;
                    data.cont_type = params.cont_type
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
                title={
                    <><LabelGrid id={'pic_nm'} /></>}
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