"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import {
  crudType,
} from "components/provider/contextObjectProvider";
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import Switch from "components/switch/index"
import { useCommonStore } from "../_store/store";
import ExcelUploadModal from "./ExcelUpload/popup"
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

const { log } = require("@repo/kwe-lib/components/logHelper");

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
  const arrTransportType = loadDatas ? loadDatas[3].data?.map((row: any) => row['type_nm']) : [];

  const cellStyles = (params:any) => {
    let transport_type = params.data.transport_type;
    let color = transport_type === "FG" ? "bg-lightskyblue" :
                transport_type === "AC" ? "bg-steelblue" : "bg-beige";
    return color;
  }
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk", "use_yn"],
    pinned : {
      // waybill_no : "left",
      // create_date : "right",
      // send : "right",
    },
    colVisible: { col : ["transport_id"], visible:false },
    dataType: { create_date: "date", pickup_dd: "date", delivery_request_dd:"date", revised_edd : "date"
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
    editable: ["transport_type_nm", "delivery_request_dd", "reason", "use_yn"],
    rowSpan: ["origin"],
    cellClass: {
      transport_type_nm: cellStyles,
      waybill_no: cellStyles,
      mwb_no: cellStyles,
    },
  };

  const onSave = async () => {
    
      const api = gridRef.current.api;
      const changedDatas = [];
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          if (!data.delivery_request_dd) {
            toast(t("MSG_0191"));  //요청일은 필수 값입니다.
            break;
          }

          try {
            changedDatas.push(data);
          } catch (error) {
            log("error:", error);
          } finally {
            data.__changed = false;
          }
        }
      }
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
    const api = gridRef.current.api;
    for (const node of api.getRenderedNodes()) {
      var data = node.data;
      waybills.push(data.waybill_no)
    }

    if (!waybills.length) return;

    const params = {
      blyy: getValues()["fr_date"].substring(0,4),
      blno: waybills.join(' '),
    }
    await actions.getUnipassData(params);
    await actions.getAppleDatas(getValues());

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
              <Button id={"save"} onClick={onSave} width='w-34' />
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
