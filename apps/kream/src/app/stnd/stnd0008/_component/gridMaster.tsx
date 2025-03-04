
'use client';

import {useEffect, useCallback, useRef, memo, useState, } from "react";
import { SP_GetData } from "./data";
import {  crudType, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Modal from "./popup";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    initData? : any | null;
  };

const MasterGrid: React.FC<Props> = memo(({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { searchParams, isMSearch, isPopUpOpen, mSelectedRow } = objState;

    const { data, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetData, {enabled:true});
    const [ mainData, setMainData ] = useState<gridData | null>(null);

    const gridOption: GridOption = {
        colVisible: { col : ["cust_nm_chi","corp_reg_no","area_cd","cust_nm_abbr","city_nm","post_no1","post_no2","addr3","bz_kind_cd","home_page_addr","bz_type"], visible:false },
        gridHeight: "h-full",
        dataType: { "bz_reg_no" : "bizno"},
        isAutoFitColData: true,
        alignLeft: ["major_category", "bill_gr1_nm"],
        isMultiSelect : false,
    };
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        dispatch({mSelectedRow:selectedRow});
      }, []);
      
      const handleRowDoubleClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        // log("handleRowDoubleClicked", crudType.UPDATE)
        dispatch({mSelectedRow:selectedRow, isPopUpOpen:true, popType:crudType.UPDATE});
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
    }, []);

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isMSearch:false});
        }
    }, [isMSearch]);

    useEffect(() => {
        setMainData(data as gridData);
    }, [data]);

    useEffect(() => {
        if (!isPopUpOpen && mainData && mSelectedRow) {
            const data = mainData.data.map((item: any) => {
                if (item.cust_code === mSelectedRow.cust_code) {
                    const result: Record<string, any> = {};
                    for (const key in item) {
                        if (typeof mSelectedRow[key] === 'boolean' ) {
                            result[key] = mSelectedRow[key] ? 'Y' : 'N';
                        }
                        else result[key] = mSelectedRow[key];
                    }
                    return result;
                }
                return item;
            })
            setMainData({
                data : data,
                fields : mainData?.fields
            });
        }
    }, [isPopUpOpen]);

    return (
        <>
            <Grid
                id="gridMaster"
                gridRef={gridRef}
                // loadItem={initData}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                    onRowDoubleClicked : handleRowDoubleClicked,
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
                />
            <Modal
                loadItem={initData}
            />
        </>
            
    );
});

export default MasterGrid;