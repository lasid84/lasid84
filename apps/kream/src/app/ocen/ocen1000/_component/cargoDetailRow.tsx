"use client";

import { memo, useEffect, useState } from "react";
import { MaskedInputField } from "components/input";
import type { gridData } from "components/grid/ag-grid-enterprise";
import { SP_GetCargoData } from "./data";
import { SEARCH_CGD } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { SP_InsertCargo, SP_UpdateCargo } from "./data";
import { InputWrapper } from "components/wrapper";
import CustomSelect from "components/select/customSelect";
import { ReactSelect, data } from "@/components/select/react-select2";
const { log, error } = require("@repo/kwe-lib/components/logHelper");

export interface typeloadItem {
  data: {} | undefined;
}

type Props = {
  loadItem?: typeloadItem;
  bkData: any;
  seq: any;
  isRefreshCargo?: boolean;
  onDelete: (seq: number) => void;
  onPieceChange: (seq: number, pieceCount: number) => void;
  onValueChange: (seq: number, pieceCount: number) => void;
};

export type Cargo = {
  bk_id: string;
  seq: number;
  container_type: string;
  piece: number;
  // same: boolean; //상태type
  pkg_type: string;
  container_refno: string;
  seal_no: string;
  slac_stc: number;
  stc_uom: string;
  gross_wt: number;
  gross_uom: string;
  measurement: string;
  measurement_uom: string;
  //dg_yn: boolean;
  length: number;
  width: number;
  height: number;
  weight: number;
  soc: string;
  empty: string;
  temp: number;
  vent: string;
  un_no: string;
  class: string;
  description: string;
};

const CargoFCL = memo(
  ({
    loadItem,
    bkData,
    index,
    isRefreshCargo,
    onPieceChange,
    onDelete,
    onValueChange,
  }: any) => {

    var cargoItem = bkData.cargo;
    const [containertype, setContainertype] = useState<any>()
    const [pkgtype, setPkgtype] = useState<any>()
    const [slacuom, setSlacuom] = useState<any>()
    const [grossuom, setGrossuom] = useState<any>()
    const [measurementuom, setMeasurementuom] = useState<any>()
    const [ isDisplay, setDisplay ] = useState(true);

    useEffect(()=>{
      if(bkData?.cargo?.isHandlePieceChange || (bkData?.cargo?.group && bkData?.cargo?.group !==bkData?.cargo.seq)){
        setDisplay(false)
      }else {
        setDisplay(true)
      }
    },[bkData?.cargo?.isHandlePieceChange])

    useEffect(() => {
      if (loadItem?.length) {
        setContainertype(loadItem[16]);
        setPkgtype(loadItem[22])
        setSlacuom(loadItem[23])
        setGrossuom(loadItem[24])
        setMeasurementuom(loadItem[25])
      }
    }, [loadItem?.length]);

    const handlePieceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value)) {
        onPieceChange(cargoItem.seq, value, index);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = event.target.id;

      const replaced_id = id.split("-").reverse()[0]
      log('replaced_id', replaced_id)
      const value = event.target.value;
      onValueChange(cargoItem.seq, replaced_id, value, index);
    };

    const handleFieldReadOnly = (field: string) => {
      const containerType = bkData?.cargo && bkData?.cargo.container_type;    
      if(containerType){
        switch (true) {
          case containerType.includes("OT"): // OPEN TOP
          //log('?', ["length", "width", "height", "weight"].includes(field))
            return ["length", "width", "height", "weight"].includes(field)
          case containerType.includes("FR"): // FLAT RACK
            return ["length", "width", "height", "weight"].includes(field)
          case containerType.includes("R"): // REEFER
            return ["temp", "vent"].includes(field)
          case containerType.includes("TC"): // TANK
            return ["soc", "empty"].includes(field)
          default:
            return false;
        }
      }
    };
    
    // useEffect(()=>{
    //   log('bkData.cargo.isHandlePieceChange', bkData.cargo.isHandlePieceChange)
    // },[bkData?.cargo])

    return (
      <>
        <div className="flex-row w-full">
          <div className="flex flex-wrap">
            <InputWrapper outerClassName="pt-4" inline={false}>
              <Button
                id={bkData?.cargo?.seq}
                onClick={() => onDelete(bkData?.cargo?.seq)}
                size="20"
                label="delete"
                isLabel={false}
                isDisplay={isDisplay}
              />
            </InputWrapper>

            <div className="flex w-48">              
              <CustomSelect
                id="container_type"
                initText="Select.."
                listItem={containertype as gridData}
                valueCol={["container_type", "container_type_nm"]}
                displayCol="container_type_nm"
                gridOption={{
                  colVisible: {
                    col: ["container_type", "container_type_nm"],
                    visible: true,
                  },
                }}
                events={{
                  onSelectionChanged: (e, id, value) => {
                      var id = id
                      var value = value
                      onValueChange(cargoItem.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={bkData?.cargo?.container_type}
                isDisplay={isDisplay}
                inline={false}
              />
            </div>
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_piece`}
              //key={`masked-input-${bkData?.cargo?.seq}_piece`} 
              id={`masked-input-${bkData?.cargo?.seq}-piece`} 
              label="piece"
              value={bkData?.cargo?.piece}
              events={{ onChange: handlePieceChange }}
              options={{type:"number", limit:2}}
              isDisplay={isDisplay}
              width="w-24"
            />

            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_pkg_type`}
              id="pkg_type"
              value={bkData?.cargo?.pkg_type}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
           <div className="flex w-28">              
              <CustomSelect
                id="pkg_type"
                initText="Select.."
                listItem={pkgtype as gridData}
                valueCol={["pkg_type", "pkg_type_nm"]}
                displayCol="pkg_type_nm"
                gridOption={{
                  colVisible: {
                    col: ["pkg_type", "pkg_type_nm"],
                    visible: true,
                  },
                }}
                events={{
                  onSelectionChanged: (e, id, value) => {
                      var id = id
                      var value = value
                      onValueChange(cargoItem.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={bkData?.cargo?.pkg_type}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_container_refno`}
              id={`${index}_${bkData?.cargo?.seq}-container_refno`}              
              label="container_refno"
              value={bkData?.cargo?.container_refno}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-40"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_seal_no`}
              id={`${index}_${bkData?.cargo?.seq}-seal_no`}              
              label="seal_no"
              value={bkData?.cargo?.seal_no}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-40"
            />

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_slac_stc`}
              id={`${index}_${bkData?.cargo?.seq}-slac_stc`}              
              label="slac_stc"
              value={bkData?.cargo?.slac_stc}
              events={{ onChange: handleChange }}
              options={{type:"number"}}
              width="w-24"
            />
            {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_slac_uom`}
              id="slac_uom"
              value={bkData?.cargo?.slac_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}

            <div className="flex w-28">              
              <CustomSelect
                id="slac_uom"
                initText="Select.."
                listItem={slacuom as gridData}
                valueCol={["slac_uom", "slac_uom_nm"]}
                displayCol="slac_uom_nm"
                gridOption={{
                  colVisible: {
                    col: ["slac_uom", "slac_uom_nm"],
                    visible: true,
                  },
                }}
                events={{
                  onSelectionChanged: (e, id, value) => {
                      var id = id
                      var value = value
                      onValueChange(cargoItem.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={bkData?.cargo?.slac_uom}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_gross_wt`}
              id={`${index}_${bkData?.cargo?.seq}-gross_wt`}              
              label="gross_wt"
              value={bkData?.cargo?.gross_wt}
              events={{ onChange: handleChange }}
              options={{type:"number"}}
              width="w-24"
            />
            
            {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_gross_uom`}
              id="gross_uom"
              value={bkData?.cargo?.gross_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
              <div className="flex w-28">
              <CustomSelect
                id="gross_uom"
                initText="Select.."
                listItem={grossuom as gridData}
                valueCol={["gross_uom", "gross_uom_nm"]}
                displayCol="gross_uom_nm"
                gridOption={{
                  colVisible: {
                    col: ["gross_uom", "gross_uom_nm"],
                    visible: true,
                  },
                }}
                events={{
                  onSelectionChanged: (e, id, value) => {
                      var id = id
                      var value = value
                      onValueChange(cargoItem.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={bkData?.cargo?.gross_uom}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_measurement`}
              id={`${index}_${bkData?.cargo?.seq}-measurement`}              
              label="measurement"
              value={bkData?.cargo?.measurement}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />
            {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_measurement_uom`}
              id="measurement_uom"
              value={bkData?.cargo?.measurement_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
             <div className="flex w-28">              
              <CustomSelect
                id="measurement_uom"
                initText="Select.."
                listItem={measurementuom as gridData}
                valueCol={["measurement_uom", "measurement_uom_nm"]}
                displayCol="measurement_uom_nm"
                gridOption={{
                  colVisible: {
                    col: ["measurement_uom", "measurement_uom_nm"],
                    visible: true,
                  },
                }}
                events={{
                  onSelectionChanged: (e, id, value) => {
                      var id = id
                      var value = value
                      onValueChange(cargoItem.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={bkData?.cargo?.measurement_uom}
                inline={false}
              />
            </div>

            {/* DG 체크박스 추가예정 */}
          </div>

          <div className="flex flex-wrap">
            <div className="flex w-10"></div>
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_length`}
              id={`${index}_${bkData?.cargo?.seq}-length`}              
              label="length"
              value={bkData?.cargo?.length}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("length"),type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_width`}
              id={`${index}_${bkData?.cargo?.seq}-width`}              
              label="width"
              value={bkData?.cargo?.width}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("width"),type:"number" }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_height`}
              id={`${index}_${bkData?.cargo?.seq}-height`}              
              label="height"
              value={bkData?.cargo?.height}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("height"),type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_weight`}
              id={`${index}_${bkData?.cargo?.seq}-weight`}              
              label="weight"
              value={bkData?.cargo?.weight}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("weight"),type:"number" }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_soc`}
              id={`${index}_${bkData?.cargo?.seq}-soc`}              
              label="soc"
              value={bkData?.cargo?.soc}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("soc") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_empty`}
              id={`${index}_${bkData?.cargo?.seq}-empty`}              
              label="empty"
              value={bkData?.cargo?.empty}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("empty") }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_temp`}              
              id={`${index}_${bkData?.cargo?.seq}-temp`}
              label="temp"
              value={bkData?.cargo?.temp}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("temp"),type:"number" }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_vent`}
              id={`${index}_${bkData?.cargo?.seq}-vent`}              
              label="vent"
              value={bkData?.cargo?.vent}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("vent") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_un_no`}
              id={`${index}_${bkData?.cargo?.seq}-un_no`}              
              label="un_no"
              value={bkData?.cargo?.un_no}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("un_no") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_class`}
              id={`${index}_${bkData?.cargo?.seq}-class`}              
              label="class"
              value={bkData?.cargo?.class}
              events={{ onChange: handleChange }}
              options={{isReadOnly : !handleFieldReadOnly("class") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_volume_factor`}
              id={`${index}_${bkData?.cargo?.seq}-volume_factor`}
              label="volume_factor"
              value={bkData?.cargo?.volume_factor}
              events={{ onChange: handleChange }}
              options={{ isReadOnly :  true,type:"number" }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_commodity_cd`}
              id={`${index}_${bkData?.cargo?.seq}-commodity_cd`}
              label="commodity_cd"
              value={bkData?.cargo?.commodity_cd}
              events={{ onChange: handleChange }}
              options={{ isReadOnly :  true }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_hs_cd`}
              id={`${index}_${bkData?.cargo?.seq}-hs_cd`}
              label="hs_cd"
              value={bkData?.cargo?.hs_cd}
              events={{ onChange: handleChange }}
              options={{ isReadOnly :  true }}
              width="w-24"
            />
          </div>
        </div>
      </>
    );
  }
);

export const CargoLCL = memo(
  ({
    loadItem,
    bkData,
    index,
    isRefreshCargo,
    onPieceChange,
    onDelete,
    onValueChange,
  }: any) => {
    const [containertype, setContainertype] = useState<any>();
    var cargoItem = bkData.cargo;

    useEffect(() => {
      if (loadItem?.length) {
        setContainertype(loadItem[16]);
      }
    }, [loadItem?.length]);

    const handlePieceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value)) {
        onPieceChange(cargoItem.seq, value, index);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = event.target.id;
      const value = event.target.value;
      onValueChange(cargoItem.seq, id, value, index);
    };

    return (
      <>
        <div className="flex-row w-full">
          <div className="flex flex-wrap">
            <InputWrapper outerClassName="pt-4" inline={false}>
              <Button
                id={bkData?.cargo?.seq}
                onClick={() => onDelete(bkData?.cargo?.seq)}
                size="20"
                label="delete"
                isLabel={false}
              />
            </InputWrapper>
            
            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_piece`}
              id="piece"
              value={bkData?.cargo?.piece}
              events={{ onChange: handlePieceChange }}
              options={{ type:"number" }}
              width="w-24"
            />

            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_pkg_type`}
              id="pkg_type"
              value={bkData?.cargo?.pkg_type}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />

              <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_slac_stc`}
              id="slac_stc"
              value={bkData?.cargo?.slac_stc}
              events={{ onChange: handleChange }}
              options={{type:"number"}}
              width="w-24"
            />
             {/* selectbox 수정예정 */}
              {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_slac_uom`}
              id="slac_uom"
              value={bkData?.cargo?.slac_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
              <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_length`}
              id="length"
              value={bkData?.cargo?.length}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />           
            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_width`}
              id="width"
              value={bkData?.cargo?.width}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />
             <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_height`}
              id="height"
              value={bkData?.cargo?.height}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />           
            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_weight`}
              id="weight"
              value={bkData?.cargo?.weight}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />
            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_gross_wt`}
              id="gross_wt"
              value={bkData?.cargo?.gross_wt}
              events={{ onChange: handleChange }}
              options={{type:"number"}}
              width="w-24"
            />
            {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_gross_uom`}
              id="gross_uom"
              value={bkData?.cargo?.gross_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
            <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_measurement`}
              id="measurement"
              value={bkData?.cargo?.measurement}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            />
            {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_measurement_uom`}
              id="measurement_uom"
              value={bkData?.cargo?.measurement_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}

          </div>
        </div>
      </>
    );
  }
);

export default CargoFCL;
