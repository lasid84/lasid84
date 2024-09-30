import DialogBasic from "layouts/dialog/dialog"
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { useAppContext } from "components/provider/contextObjectProvider"
import { Button } from "components/button"
import { useTranslation } from "react-i18next";
import Grid, { gridData, ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import { useGetData, useUpdateData2 } from "@/components/react-query/useMyQuery";
import { GridOption } from "@/components/grid/ag-grid-enterprise";
import { CellValueChangedEvent, IRowNode } from "ag-grid-community";
import { SP_GetBkHblData, SP_SaveBkHblData } from "../data";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    bkData: any;
    initData?: any | null;
    callbacks?: Array<() => void>;
}

const AddWaybillNo: React.FC<Props> = ({ initData, callbacks, bkData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { isWaybillPopupOpen: isOpen } = objState;
    const [ waybill_no, setWaybillNo] = useState<string>('');

    const { t } = useTranslation();
    const { Create } = useUpdateData2(SP_SaveBkHblData, '');
    
    const closeModal = (hbl:string) => {
        if (callbacks?.length) callbacks?.forEach((callback) => callback());
        
        dispatch({ isWaybillPopupOpen: false, [bkData?.bk_id]: {...bkData, waybill_no: hbl} });
    }

    const { isLoading, data, refetch, remove } = useGetData(bkData, '', SP_GetBkHblData, {enabled:true});

    const gridOptions: GridOption = {
        colVisible: { col: ["bk_id"], visible: false },
        gridHeight: "h-full",
        checkbox: ["use_yn"],
        minWidth: { "waybill_no": 120 },
        maxWidth : {"use_yn": 80},
        editable: ["waybill_no", "remark", "use_yn"],
        // dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno", "remark":"largetext" },
        isAutoFitColData: false,
    };

    useEffect(() => {
        if (isOpen && bkData) {
            remove();
            refetch();
            setWaybillNo(bkData.waybill_no);
        }
    }, [isOpen, bkData]);

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        // log("handleCellValueChanged", param)
    //     gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
    //         // log("handleCellValueChanged2", param.node.data);
    //         if (!param.node.data.def) return;
    //         if (node.id === param.node.id) return;

    //         if (node.data.def === true) {
    //             node.setDataValue('def', false);
    //             // node.setDataValue('__change', true);
    //         }
    //     });
    };

    const onSave = useCallback(async () => {
        const api = gridRef.current.api;
        var waybillValid: any[] = [];
        var waybillArr = [];
        var remarkArr = [];
        var useYnArr: any[] = [];
        for (const node of api.getRenderedNodes()) {
          let data = node.data;
          gridOptions?.checkbox?.forEach((col) => {
            data[col] = (data[col] || data[col] === undefined) ? "Y" : "N";
          });
          
          if (data.use_yn === 'Y') waybillValid.push(data.waybill_no);
          if (data.__changed) {
              waybillArr.push(data.waybill_no);
              remarkArr.push(data.remark);
              useYnArr.push(data.use_yn);
          }
        }

        if (waybillArr.length) {
            let data = {
                bk_id: bkData.bk_id,
                waybill_no: waybillArr.join(','),
                remark: remarkArr.join(','),
                use_yn: useYnArr.join(',')
            };

            await Create.mutateAsync(data, {
            onSuccess(data, variables, context) {
                closeModal(waybillValid.join(','));
            },
            })
            .catch(() => {});
        }

      }, [bkData]);

    const onAdd = () => {
        rowAdd(gridRef.current, { "use_yn":true })
    }

    const handleGridReady = (e:any) => {
        onAdd();
    }

    const handleCellKeyDown = (e:any) => {
        if (e.value && e.event.key === 'Enter') onAdd();
    }

    return (
        <DialogBasic
            isOpen={isOpen}
            onClose={() => {
                closeModal(waybill_no);
            }}
            title={t("Waybill 등록")}
            bottomRight={
                    <>
                        <Button id={"add"} onClick={onAdd} width='w-15'/>
                        <Button id={"save"} onClick={onSave} width='w-15'/>
                    </>
                }>
            <div className="flex flex-col w-[38rem] h-[28rem] gap-4 w-30 ">
                <Grid
                    gridRef={gridRef}
                    listItem={data as gridData}
                    options={gridOptions}
                    event={{
                        // onCellValueChanged: handleCellValueChanged,
                        onGridReady: handleGridReady,
                        onCellKeyDown: handleCellKeyDown
                    }}
                />
            </div>
        </DialogBasic>
    )
}

export default AddWaybillNo;