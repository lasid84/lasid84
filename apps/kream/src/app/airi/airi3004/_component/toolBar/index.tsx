import { useEffect, memo } from "react";

import type { GridOption } from "components/grid/ag-grid-enterprise";
import { useFormContext } from "react-hook-form";

import { DateToString } from "@repo/kwe-lib-new";
import { Button } from "components/button";
import { MaskedInputField } from "components/input/react-text-mask";
import { DatePicker } from "components/date";

import { Tab } from "./tab";
import { useCommonStore } from "../../_store/store";

type Props = {
    gridRef: React.MutableRefObject<any>;
    gridOptions: GridOption;
};

export const ToolBar = memo((props: Props) => {
    const { getValues } = useFormContext();

    const { getOperationListData } = useCommonStore((state) => state.actions);
    const searchParams = useCommonStore((state) => state.searchParams);
    const mainDatas = useCommonStore((state) => state.mainDatas);

    /**
     * @Handler
     * Summary : 전체 컬럼 출력
     */
    const handleFullColumn = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const columnApi = props.gridRef.current?.api;
    if (columnApi) {
        let columns = columnApi.getAllGridColumns()?.map((col: any) => col.getColId());
        if (props.gridOptions?.colVisible) {
            const invisibleList = props.gridOptions.colVisible.col;
            columns = columns.filter((col:string) => !invisibleList.includes(col));
        }
        columnApi.setColumnsVisible(columns, true);
        /**
         * @dev
         * getRowHeight를 재호출하기 위함.
         */
        columnApi.resetRowHeights();
    }
    };

    /**
     * @Handler
     * Summary : 마일스톤 관련 컬럼만 출력
     */
    const handleMilestoneColumn = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const pinnedColumns = Object.keys(props.gridOptions.pinned || {});
        const milestoneColumns = ["arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"];
        const visibleColumns = [...milestoneColumns, ...pinnedColumns];

        columnVisibleController(visibleColumns);
    };

    /**
     * @Handler
     * Summary : IRR/C2 관련 컬럼만 출력
     */
    const handleIRRC2Column = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        
        const pinnedColumns = Object.keys(props.gridOptions.pinned || {});
        const irrColumns = ["loading_remark", "edi_yn"];
        const visibleColumns = [...irrColumns, ...pinnedColumns];

        columnVisibleController(visibleColumns);
    };

    /**
     * @Function
     * Summary : 컬럼 visible 핸들러에서 컬럼 visible control을 위한 로직 공통화 함수.
     */
    const columnVisibleController = (visibleColumns: string[]) => {
        const columnApi = props.gridRef.current?.api;
        if (columnApi) {
            const columns = columnApi.getAllGridColumns();

            /**
             * @dev
             * 특정 컬럼 invisible 전 모든 컬럼 visible
             */
            const allColumns = columns.map((col: any) => col.getColId());
            columnApi.setColumnsVisible(allColumns, true);

            const restOfColumn = columns?.map((col: any) => col.getColId())
            .filter((id: any) => !visibleColumns.includes(id));

            columnApi.setColumnsVisible(restOfColumn, false);

            /**
             * @dev
             * getRowHeight를 재호출하기 위함.
             */
            columnApi.resetRowHeights();
        }
    };

    /**
     * @Handler
     * Summary : Waybiil No 검색.
     */
    const handleSearch = async () => {
        const params = getValues();
        props.gridRef.current?.api.showLoadingOverlay();
        await getOperationListData(params.fr_date, params.no);
        props.gridRef.current?.api.hideOverlay();
    };

    /**
     * @Handler
     * Summary : 배차리스트 날짜 변경 시 데이터 변경
     */
    const handleDatePickerValue = async (event: React.SyntheticEvent<any> | undefined, id: string, date: Date | null) => {
        const frDate = DateToString(date);
        if (frDate && props.gridRef) {
            props.gridRef.current?.api.showLoadingOverlay();
            await getOperationListData(frDate);
            props.gridRef.current?.api.hideOverlay();
        }
    };

    /**
     * @Function
     * Summary : mainData의 모든 컬럼 visible 로직 공통화 함수.
     */
    const columnAllVisible = () => {
        const columnApi = props.gridRef.current?.api;
        if (columnApi) {
            const columns = columnApi.getAllGridColumns()?.map((col: any) => col.getColId());
            columnApi.setColumnsVisible(columns, true);

            /**
             * @dev
             * getRowHeight를 재호출하기 위함.
             */
            columnApi.resetRowHeights();
        }
    };

    /**
     * @Function
     * grid data 변경 시 모든 컬럼 visible 처리.
     */
    useEffect(() => {
        columnAllVisible();
    }, [mainDatas]);

    return (
        <div className="flex flex-row justify-between bg-white pl-0.5">
            <Tab event={{
                    onClickFull: handleFullColumn,
                    onClickMilestone: handleMilestoneColumn,
                    onClickIRRC2: handleIRRC2Column
                }}
            />
            <div className="flex">
            <MaskedInputField
              id="no"
              label="waybill_no"
              value={searchParams?.no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
              width= "w-96"
              height="h-8"
              events={{
                onKeyDown(e) {
                    if (e.key === "Enter") handleSearch();
                },
              }}
            />
            <Button id="search" size="10" onClick={handleSearch} />
          </div>
          <DatePicker
            id="fr_date"
            value={searchParams?.fr_date}
            options={{
              inline: true,
              textAlign: "center",
              freeStyles: "p-1 border-1 border-slate-300",
              isShowButton: true,
              noLabel: true
            }}
            lwidth="w-20"
            height="h-8"
            events={{
              onChange: handleDatePickerValue
            }}
          />
        </div>
    );
});