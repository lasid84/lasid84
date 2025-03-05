"use client";

import React, {
  useEffect,
  useCallback,
  KeyboardEvent,
  useRef,
  memo,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
import { toastSuccess } from "components/toast";
import { PageMGrid4 } from "layouts/grid/grid";
import { Button } from "components/button";
import Grid, { ROW_CHANGED, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import {
  CellValueChangedEvent,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { useCommonStore, AmountInputOptions_g, Category } from "../_store/store";
import DetailModal from "./Detail/popup";
import { DatePicker } from "components/date";
import CustomSelect from "components/select/customSelect";
import { MaskedInputField } from "@/components/input/react-text-mask";
import ResizableLayout from "../../../stnd/stnd0016/_component/DetailInfo/Layout/ResizableLayout";
import ExcelUploadModal from "./ExcelUpload/popup";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import { useTranslation } from "react-i18next";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const RVInfo: React.FC<Props> = ({ loadItem, params }) => {
  const actions = useCommonStore((state) => state.actions);
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const [gridApi, setGridApi] = React.useState<any>(null);
  const [custcode, setCustcode] = useState<any>();
  const { getValues } = useFormContext();
  const handleMaskedInputWithVatUpdate = useCallback(
    (e: any) => {
      if (!mainSelectedRow || !gridApi) return;

      // 문자열에서 ',' 제거 후 숫자로 변환
      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;

      const numericValue = Number(sanitizedValue);

      if (isNaN(numericValue)) {
        return;
      }

      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);

      const updatedRow = {
        ...mainSelectedRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      };

      actions.setMainSelectedRow(updatedRow);
      const rowNode = gridApi.getRowNode(mainSelectedRow.__ROWINDEX - 1);

      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow, gridApi]
  );

  const handleChange = useCallback(
    (e: any, id: any, date: any) => {
      const params = getValues();
      log("params", params, params[id]);
      const updatedRow = {
        ...mainSelectedRow,
        id: params[id],
        __changed: true,
      };
      actions.setMainSelectedRow(updatedRow);
      const rowNode = gridApi.getRowNode(mainSelectedRow?.__ROWINDEX - 1);

      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow]
  );


  const handleVatInputChange = useCallback(
    (e: any) => {
      if (!mainSelectedRow || !gridApi) return;

      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;

      const numericValue = Number(sanitizedValue);

      if (isNaN(numericValue)) {
        // console.warn("Invalid numeric input:", e.target.value);
        return;
      }

      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.round(numericValue * 0.1);

      const updatedRow = {
        ...mainSelectedRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      };
      actions.setMainSelectedRow(updatedRow);

      const rowNode = gridApi.getRowNode(mainSelectedRow.__ROWINDEX - 1);
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow, gridApi]
  );


  return (
    <>
      <div className="col-span-2">
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="bonded_wh"
            value={mainSelectedRow?.bonded_wh}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="customs_clearance"
            value={mainSelectedRow?.customs_clearance}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>
        {/*특별통관료*/}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="special_handling"
            value={mainSelectedRow?.special_handling}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
                    <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>

        {/* 운송료 */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="trucking"
            value={mainSelectedRow?.trucking}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
                  <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>
        {/* 항공료 */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="air_freight"
            value={mainSelectedRow?.air_freight}
            events={{
              onChange: handleVatInputChange,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
        </div>
        {/* H/C */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="bl_handling"
            value={mainSelectedRow?.bl_handling}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>
        {/* 개청료 */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="dispatch_fee"
            value={mainSelectedRow?.dispatch_fee}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>

        {/* K수수료 */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="dtd_handling"
            value={mainSelectedRow?.dtd_handling}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
           <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>
        {/* 보험료 */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="insurance_fee"
            value={mainSelectedRow?.insurance_fee}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
        </div>

        {/* 기타수수료(other1) */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="other_1"
            value={mainSelectedRow?.other_1}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
            inline={false}
          />
        </div>

        
        {/* 기타수수료(other2) */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="other_1"
            value={mainSelectedRow?.other_1}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>

        
        {/* 기타수수료(other3) */}
        <div className="grid grid-cols-2 gap-4">
          <MaskedInputField
            id="other_1"
            value={mainSelectedRow?.other_1}
            events={{
              onChange: handleMaskedInputWithVatUpdate,
            }}
            options={{
              ...AmountInputOptions_g,
              isReadOnly: false,
            }}
          />
          <CustomSelect
            id="cust_code"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm"],
                visible: true,
              },
            }}
            events={{
              onSelectionChanged: handleChange,
            }}
            gridStyle={{ width: "400px", height: "150px" }}
            style={{ width: "600px", height: "8px" }}
            defaultValue={mainSelectedRow?.waybill_gubn}
             inline={false}
          />
        </div>
      </div>
    </>
  );
};

export default RVInfo;
