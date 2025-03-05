"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { useCommonStore } from "../../../../_store/store";
import { useFormContext } from "react-hook-form";
import DialogBasic, { DialogArrow } from "@/layouts/dialog/dialog";
import { useTranslation } from "react-i18next";
import { log } from "@repo/kwe-lib-new";
import { toast } from "react-toastify";
import { RowNode } from "ag-grid-community";

type Props = {
  isOpen: boolean;
  onClose?: (open: boolean) => void;
};

const TransportFeeGrid: React.FC<Props> = memo((props) => {
  const { t } = useTranslation();
  const gridRef = useRef<any | null>(null);

  const { cust_code, cust_mode } = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const { getValues } = useFormContext();
  const { isOpen, onClose } = props;

  const [mainData, setMainData] = useState<gridData>();

  const standardCellStyles = (params: any) => {
    let data = params.colDef.field;
    switch (data) {
      case "standard_fee" :
      case "temp_control_fee" :
      case "dg_fee" :
          return "bg-lightpink";
      default:
          return "";
    }
  };

  const gridOptions: GridOption = {
    gridHeight: "h-full",
    colVisible: { col : ["cust_code", "cust_mode", "province_cd", "area_cd"], visible:false },
    dataType: { 
      standard_fee:"number" , wonder_standard_fee:"number", mirae_standard_fee:"number",
      temp_control_fee:"number" , wonder_temp_control_fee:"number", mirae_temp_control_fee:"number" ,
      dg_fee:"number" , wonder_dg_fee:"number", mirae_dg_fee:"number" ,
      wonder_return_rate:"number", mirae_return_rate:"number",
      wonder_turnaround_rate:"number", mirae_turnaround_rate:"number" 
    },
    // total: { transport_type_nm:"count", num_pieces:"sum" , gross_weight:"sum", chargeable_weight:"sum" },
    isShowRowNo:false,
    isAutoFitColData: false,
    isMultiSelect: false,
    editable: ["standard_fee", "wonder_standard_fee", "mirae_standard_fee",
      "temp_control_fee", "wonder_temp_control_fee", "mirae_temp_control_fee",
      "dg_fee", "wonder_dg_fee", "mirae_dg_fee",
      "wonder_return_rate", "mirae_return_rate",
      "wonder_turnaround_rate", "mirae_turnaround_rate"
    ],
    cellClass: {
      standard_fee: standardCellStyles,
      temp_control_fee: standardCellStyles, 
      dg_fee: standardCellStyles
    }
  };

  useEffect(() => {
    (async () => {
      const param = {
        cust_code: cust_code,
        cust_mode: cust_mode
      }
      // log("param", param);
      const data = await actions.getTransportFee(param);
      setMainData(data);
    })();
    
  }, [cust_code])

  const onSave = async () => {
      const api = gridRef.current.api;
      const changedDatas:any = [];
      await api.forEachNode((node:RowNode) => {
        var data = node.data;
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          try {
            changedDatas.push(data);
          } catch (error) {
            log("error:", error);
          } finally {
            data.__changed = false;
          }
        }
      });
      
      if (changedDatas.length > 0) {
        const param = {jsonData: JSON.stringify(changedDatas)};
        // log("{jsonData: JSON.stringify(changedDatas)}", param);
        await actions.setTransportFee(param);
      } else {
        toast(t("msg_0006"));  //변경 내역이 없습니다.
      }

      api.redrawRows();
  };


  const handleClose = (open:boolean) => onClose?.(open);

  return (
    <DialogBasic
            isOpen={isOpen}
            onClose={() => {
                handleClose(false);
            }}
            title={t("trucking")}
            bottomRight={
                    <>
                        <Button id={"save"} onClick={onSave} width='w-15'/>
                        <Button id={"cancel"} onClick={() => handleClose(false)} width='w-15'/>
                    </>
                }>
            <div className="relative inline-block w-[90vw] h-[50vh] max-w-full">
                <Grid
                    id="popTruckingChargeGrid"
                    gridRef={gridRef}
                    listItem={mainData}
                    options={gridOptions}
                    event={{
                    }}
                />
            </div>
        </DialogBasic>
  );
});

export default TransportFeeGrid;
