
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetUFSChargeData } from "./_component/data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { Button } from 'components/button';
import { t } from "i18next";
import DialogBasic from "@/layouts/dialog/dialog";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    ref?: any | null
    initData?: any | null
    isOpen: boolean;
    params: {
        trans_mode: string
        trans_type: string
    }
    callbacks?: Array<() => void>;
    onSelect: (selectedRow: any) => void; // Add this line
};

const ChargeCode: React.FC<Props> = ({ ref = null, initData, isOpen, params, callbacks, onSelect }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const [gridOptions, setGridOptions] = useState<GridOption>();
    const [gridData, setGridData] = useState<gridData>();
    const [selectedRow, setSelectedRow] = useState({charge_code: ""});

    const { data, refetch, remove } = useGetData({...params}, "UFSChargeCode", SP_GetUFSChargeData);

    useEffect(() => {
        // let arrDept = [];
        // if (initData) {
        //     arrDept = initData[0]?.data.map((row: any) => row['user_dept'])
        // }
        // log(initData[0].data)
        const gridOption: GridOption = {
            colVisible: { col: [], visible: false },
            gridHeight: "h-full",
            isAutoFitColData: false,
        };

        setGridOptions(gridOption);
        
    }, [initData])

    useEffect(() => {
      const fetchData = async () => {
        const data = await refetch();
        setGridData(data);
        log("Charge data", data, params);
      };
      fetchData();
    }, []);

    const closeModal = () => {
      if (callbacks?.length) callbacks?.forEach((callback) => callback());
    }
    const handleChargeCodeSelect = () => {
        onSelect(selectedRow);
        closeModal();
    }

    return (
      <DialogBasic
        isOpen={isOpen}
        onClose={() => {
            closeModal();
        }}
        title={t("Charge Code")}
        bottomRight={
                <>
                    {/* <Button id={"add"} onClick={onAdd} width='w-15'/> */}
                    <Button id={"ok"} onClick={handleChargeCodeSelect} width='w-15'/>
                </>
            }>
        <div className="flex flex-col w-[38rem] h-[28rem] gap-4 w-30 ">
            <Grid
                id="pop_charge"
                gridRef={gridRef}
                listItem={data as gridData}
                options={gridOptions}
                event={{
                  onSelectionChanged(params) {
                    const selectedRow = params.api.getSelectedRows()[0];
                    setSelectedRow(selectedRow);
                  },
                  onRowDoubleClicked(params) {
                    const selectedRow = params.data;
                    setSelectedRow(selectedRow);
                    handleChargeCodeSelect();
                  }
                }}
            />
        </div>
      </DialogBasic>

    );
}

export default ChargeCode;