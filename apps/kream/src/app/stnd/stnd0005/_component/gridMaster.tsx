
'use client';

import { useEffect, useRef } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { onRowClicked, onSelectionChanged, onGridRowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import Modal from './popup';
import { TButtonBlue } from "components/form";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community"
import PageContent from "@/layouts/search-form/page-search-row";
import { PopType } from "@/utils/modal";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null;
};

const MasterGrid: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    // const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enable: false });
    const gridOption: GridOption = {
        colVisible: { col: ["grp_cd", "grp_cd_nm", "cd", "cd_nm", "cd_desc", "cd_mgcd1", "cd_mgcd2", "use_yn"], visible: true },
        colDisable: ["grp_cd", "grp_cd_nm", "cd"],
        checkbox: ["use_yn"],
        gridHeight: "70vh",
        // dataType: { "bz_reg_no":"bizno"},
        // isMultiSelect: false,
        isAutoFitColData: false,
    };


    const handleRowClicked = (param: RowClickedEvent) => {
        var data = onRowClicked(param);
        log("handleRowClicked", data)
        dispatch({ isPopupOpen: true, crudType: PopType.UPDATE })
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = onSelectionChanged(param);
        log("handleSelectionChanged", selectedRow);
        dispatch({ mSelectedRow: selectedRow, isMSearch: true });
    };

    useEffect(() => {
        if (objState.isMSearch) {
            //mainRefetch();
            log("mainisSearctqtqwttqh", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState.isMSearch]);

    const onSave = () => {
        log("===================", objState.mSelectedRow, objState.isMSearch, objState.dSelectedRow);

    }
    const onPopup = () => {
        log("--------------------", objState.isPopupOpen, objState.crudType)
        dispatch({ isPopupOpen: true, crudType: PopType.CREATE })
    }

    // const onPopup2 = () => {
    //     log("--------------------", objState.isPopupOpen, objState.crudType)
    //     dispatch({ isPopupOpen: true, crudType: PopType.UPDATE })
    // }

    return (
        <>
            <PageContent
                right={
                    <>
                        <TButtonBlue label={"add"} onClick={() => onGridRowAdd(gridRef.current)} />
                        <TButtonBlue label={"save"} onClick={onSave} />
                        <TButtonBlue label={"new"} onClick={onPopup} />
                        {/* <TButtonBlue label={"popup2"} onClick={onPopup2} /> */}
                    </>
                }>
                <></>
            </PageContent>
            <Grid
                gridRef={gridRef}
                loadItem={initData}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
            />
            <Modal initData={initData} />

        </>

    );
}

export default MasterGrid;