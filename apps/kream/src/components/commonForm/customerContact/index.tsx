
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
import { CellValueChangedEvent, IRowNode, RowClickedEvent, RowNode, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { LabelGrid } from "components/label";

import { log, error } from '@repo/kwe-lib-new';
import GridMaster from "./_component/gridMaster";

type Props = {
    initData?: any | null
    params: {
        cust_code: string
        cont_type: string
    }
    title?: string
    titleColor?: string
};

const CustCont: React.FC<Props> = ({ initData, params, title = 'pic_nm', titleColor }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    // const { data, refetch, remove } = useGetData({...params}, SEARCH_D, SP_GetDetailData);

    // useEffect(() => {
    //     remove();
    //     refetch();
    // }, []);

    // useEffect(() => {
    //     if (objState.isDSearch) {
    //         refetch();
    //       dispatch({ isDSearch: false });
    //     }
    //   }, [objState.isDSearch]);

    const onSave = () => {
        const processNodes = async () => {
          const api = gridRef.current.api;
          const nodes: RowNode[] = [];
            
          api.forEachNode((node: RowNode) => {
            nodes.push(node);
          });
          for (const node of nodes) {
            var data = node.data;
            // gridOptions?.checkbox?.forEach((col) => {
            //   data[col] = data[col] ? "Y" : "N";
            // });
            
            for (const [col, val] of Object.entries(data)) {
              const colInfo = api.getColumnDef(col);
              log("col, val", colInfo, col, val)
              if (colInfo?.cellEditor === 'agCheckboxCellEditor') {
                data[col] = val ? "Y" : "N";
              }
            }

            if (data.__changed) {
              try {
                if (data.__ROWTYPE === ROW_TYPE_NEW) {
                    data.cust_code = params.cust_code;
                    data.cont_type = params.cont_type
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
                    <><LabelGrid id={title} textColor={titleColor} /></>}
                right={
                    <>
                        <Button id={"add"} disabled={!params?.cust_code} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false, cont_type: params.cont_type })} width='w-15'/>
                        <Button id={"save"} disabled={!params?.cust_code} onClick={onSave} width='w-15'/>
                    </>
                }>
                <GridMaster ref={gridRef} params={params}/>
            </PageGrid>
        </>

    );
}

export default CustCont;