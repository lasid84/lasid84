"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import {
  crudType,
} from "components/provider/contextObjectProvider";
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { useCommonStore } from "../_store/store";
import ExcelUploadModal from "./ExcelUpload/popup"
import { toast } from "react-toastify";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

import { log, error, sleep } from '@repo/kwe-lib-new';
import { useHotkeys } from "react-hotkeys-hook";
import { RowNode } from "ag-grid-community";

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(() => {
  const gridRef = useRef<any | null>(null);

  const loadDatas = useCommonStore((state) => state.loadDatas);
  const maindDatas = useCommonStore((state) => state.mainDatas);
  const actions = useCommonStore((state) => state.actions);
  const { getValues } = useFormContext();

  const [ isUniPassCircle, setUniPassCircle] = useState<boolean>(false)

  const cellStyles = (params:any) => {
    let transport_type = params.data.transport_type;
    let color = transport_type === "FG" ? "bg-lightskyblue" :
                transport_type === "AC" ? "bg-steelblue" : "bg-beige";
    return color;
  }

  const originCellStyles = (params: any) => {
    let data = params.data.origin;

    switch (data) {
      case "BKK" :
          return "bg-lightskyblue";
      case "CKG" :
          return "bg-lightivory";
      case "HAN" :
          return "bg-lightpink";
      case "CTU" :
        return "bg-lightcyan";
      case "HKG" :
        return "bg-lightbeige";
      case "CGO" :
        return "bg-lightlavender";
      case "PVG" :
        return "bg-lightgreenbright";
      default :
        return "bg-red";
    }
  };
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk", "use_yn"],
    pinned : {
      // waybill_no : "left",
      // create_date : "right",
      // send : "right",
    },
    colVisible: { col : ["transport_id"], visible:false },
    dataType: { 
        create_date: "date", pickup_dd: "date", delivery_request_dd:"date", revised_edd : "date"
      , sla: "date_digits_8"
      , num_pieces:"number" , gross_weight:"number", chargeable_weight:"number" },
    typeOptions: {
      gross_weight: { isAllowDecimal: true, decimalLimit:1},
      chargeable_weight: { isAllowDecimal: true, decimalLimit:1},
    }, 
    total: { transport_type_nm:"count", num_pieces:"sum" , gross_weight:"sum", chargeable_weight:"sum" },
    // select: { transport_type_nm: arrTransportType },
    isShowRowNo:false,
    isAutoFitColData: true,
    isMultiSelect: false,
    // isEditableAll:true,
    editable: ["delivery_request_dd", "revised_edd", "reason", "use_yn", "sla"],
    cellClass: {
      transport_type_nm: cellStyles,
      waybill_no: cellStyles,
      mwb_no: cellStyles,
      origin: originCellStyles,
    },
    rowSpanByConfig: {
      targetCol: ["origin"],
      compareCol: {
        origin: ["all"]
      },
      standardCol: "origin"
    },
    columnVerticalCenter: ["origin"]
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      onSave();
    },
    { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] } // form 요소에서 단축키 활성화
  );

  const onSave = async () => {
    
      const api = gridRef.current.api;
      const changedDatas:any = [];
      await api.forEachNode((node:RowNode) => {
        var data = node.data;
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          if (!data.delivery_request_dd) {
            toast(t("MSG_0191"));  //요청일은 필수 값입니다.
            return;
          }

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
        await actions.setAppleDatas({jsonData: JSON.stringify(changedDatas)});
        await actions.getAppleDatas(getValues());
      } else {
        toast(t("msg_0006"));  //변경 내역이 없습니다.
      }
  };

  const onGetUniPass = async () => {

    setUniPassCircle(true);
    let waybills = [];
    let blyySet = new Set<number>();
    const api = gridRef.current.api;
    for (const node of api.getRenderedNodes()) {
      var data = node.data;
      if (!data.eta_icn) waybills.push(data.waybill_no);
      blyySet.add((new Date(data.etd_1flight)).getFullYear());
    }
    
    if (waybills.length) {
      const params = {
        blyy: Math.min(...blyySet) || getValues()["fr_date"].substring(0,4),
        blno: waybills.join(' '),
      }
      
      await actions.getUnipassData(params)
        .then(async () => {
          sleep(200);
          actions.getAppleDatas(getValues());
        });
    }
    setUniPassCircle(false);
  }

  const onExcelUpload= () => {
     actions.setState({ popup : { crudType: crudType.CREATE, isPopUpUploadOpen: true }});
  }

  return (
    <>
      <PageMGrid3
        title={<>
                <Button id={"upload_excel"} onClick = {onExcelUpload} disabled={false}  label='upload_excel' width='w-34' />
                <Button id={"btn_unipass"} label="unipass"  onClick={onGetUniPass} width="w-34" isCircle={isUniPassCircle} />
              </>
              }
        right={
            <>
              {/* <Switch/> */}
              <Button id={"save"} onClick={onSave} width='w-34' toolTip= "ctrl+s" />
            </>}
      >
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          listItem={maindDatas}
          options={gridOptions}
          event={{
          }}
        />
      </PageMGrid3>
      {/* <DetailModal loadItem={initData}/> */}
      <ExcelUploadModal />
    </>
  );
});

export default MasterGrid;
