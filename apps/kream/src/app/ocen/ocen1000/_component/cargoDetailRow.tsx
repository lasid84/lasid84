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
import { Checkbox } from "@/components/checkbox";

type Props = {
  loadItem: any,
  svc_type: string,
  cargoItem: any,
  index:number,
  // isRefreshCargo?: boolean,
  onPieceChange: (seq: number, value: number, index:number) => void;
  onDelete: (seq: number) => void;
  onChange?: (e:React.ChangeEvent<HTMLInputElement>, dataType?:string|undefined) => void;
  onValueChange:(seq:number, replaced_id:string, value:string, index:number) => void;
};

const CargoDetailRow = (props:Props) => {
  
  const {index, svc_type, cargoItem, onPieceChange, onValueChange} = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, dataType:string |undefined) => {
    const id = event.target.id;
    // const replaced_id = id.split("-").reverse()[0]
    var value = event.target.value;
    if ((dataType || '').toLowerCase() === 'number') value = value.replace(/,/g, '');
    log('CargoDetailRow handleChange', dataType)
    onValueChange(cargoItem.seq, id, value, index);
  };

  var detailProps = {
    ...props,
    onChange:handleChange
  }

  return (
    <>
    {svc_type === 'LCL' 
    ? <CargoLCL {...detailProps}/>
    : <CargoFCL {...detailProps}/>
    }
    </>
  )
}

const CargoFCL = memo(
  ({
    loadItem,
    cargoItem,
    index,
    // isRefreshCargo,
    onPieceChange,
    onDelete,
    onChange,
    onValueChange
  }: Props) => {

    const [containertype, setContainertype] = useState<any>()
    const [pkgtype, setPkgtype] = useState<any>()
    const [slacuom, setSlacuom] = useState<any>()
    const [grossuom, setGrossuom] = useState<any>()
    const [measurementuom, setMeasurementuom] = useState<any>()
    const [ isDisplay, setDisplay ] = useState(true);

    useEffect(()=>{
      if(cargoItem.isHandlePieceChange || (cargoItem?.group && cargoItem?.group !== cargoItem.seq)){
        setDisplay(false)
      }else {
        setDisplay(true)
      }
    },[cargoItem?.isHandlePieceChange])

    useEffect(() => {
      if (loadItem?.length) {
        setContainertype(loadItem[16]);
        setPkgtype(loadItem[22])
        setSlacuom(loadItem[23])
        setGrossuom(loadItem[24])
        setMeasurementuom(loadItem[25])
      }
    }, [loadItem?.length]);


    
    const handleCheckBoxClick = (id : string, val : any) => {
      const replaced_id = id.split("-")[0]
      onValueChange(cargoItem.seq, replaced_id, val, index);         
    }

    const handleFieldReadOnly = (field: string) => {
      const containerType = cargoItem && cargoItem.container_type;    
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

    const handlePieceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value)) {
        onPieceChange(cargoItem.seq, value, index);
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
                id={cargoItem?.seq}
                onClick={() => onDelete(cargoItem?.seq)}
                size="20"
                label="delete"
                isLabel={false}
                isDisplay={isDisplay}
              />
            </InputWrapper>

            <div className="flex w-48">              
              <CustomSelect
                id={getID(index, cargoItem?.seq, "container_type")}
                label="container_type"
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
                defaultValue={cargoItem?.container_type}
                isDisplay={isDisplay}
                inline={false}
              />
            </div>
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_piece`}
              //key={`masked-input-${bkData?.cargo?.seq}_piece`} 
              id={getID(index, cargoItem?.seq, "piece")}
              label="piece"
              value={cargoItem?.piece}
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
           <div className="flex w-32">              
              <CustomSelect
                id={getID(index, cargoItem?.seq, "pkg_type")}
                label="pkg_type"
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
                defaultValue={cargoItem?.pkg_type}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_container_refno`}
              id={getID(index, cargoItem?.seq, "container_refno")}
              label="container_refno"
              value={cargoItem?.container_refno}
              events={{ onChange: onChange }}
              options={{}}
              width="w-40"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_seal_no`}
              id={getID(index, cargoItem?.seq, "seal_no")}
              label="seal_no"
              value={cargoItem?.seal_no}
              events={{ onChange: onChange }}
              options={{}}
              width="w-40"
            />

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_slac_stc`}
              id={getID(index, cargoItem?.seq, "slac_stc")}
              label="slac_stc"
              value={cargoItem?.slac_stc}
              events={{ onChange: onChange }}
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
                id={getID(index, cargoItem?.seq, "slac_uom")}
                label="slac_uom"
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
                defaultValue={cargoItem?.slac_uom}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_gross_wt`}
              id={getID(index, cargoItem?.seq, "gross_wt")}
              label="gross_wt"
              value={cargoItem?.gross_wt}
              events={{ onChange: onChange }}
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
                id={getID(index, cargoItem?.seq, "gross_uom")}
                label="gross_uom"
                initText="Select.."
                listItem={grossuom as gridData}
                valueCol={["gross_uom", "gross_uom_nm"]}
                displayCol="gross_uom"
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
                defaultValue={cargoItem?.gross_uom}
                inline={false}
              />
            </div>

            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_measurement`}
              id={getID(index, cargoItem?.seq, "measurement")}
              label="measurement"
              value={cargoItem?.measurement}
              events={{ onChange: onChange }}
              options={{}}
              width="w-24"
            />
           
             <div className="flex w-28">              
              <CustomSelect
                id={getID(index, cargoItem?.seq, "measurement_uom")}
                label="measurement_uom"
                initText="Select.."
                listItem={measurementuom as gridData}
                valueCol={["measurement_uom", "measurement_uom_nm"]}
                displayCol="measurement_uom"
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
                      onValueChange(cargoItem?.seq, id, value, index);
                  },
                }}
                gridStyle={{ width: "400px", height: "200px" }}
                style={{ width: "400px", height: "8px" }}
                defaultValue={cargoItem?.measurement_uom}
                inline={false}
              />
            </div>
             {/* selectbox 수정예정 */}
            {/* <MaskedInputField
              key={`${index}_${bkData?.cargo?.seq}_measurement_uom`}
              id="measurement_uom"
              value={bkData?.cargo?.measurement_uom}
              events={{ onChange: handleChange }}
              options={{}}
              width="w-24"
            /> */}
            <Checkbox id={getID(index, cargoItem?.seq, "dg_yn")}
                      label="dg" value={cargoItem?.dg_yn} 
                      options={{inline:false}}
                      events ={{
                        onChange : handleCheckBoxClick
                        }}/>
            {/* DG 체크박스 추가예정 */}
          </div>

          <div className="flex flex-wrap">
            <div className="flex w-10"></div>
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_length`}
              id={getID(index, cargoItem?.seq, "length")}
              label="length"
              value={cargoItem?.length}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("length"),type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_width`}
              id={getID(index, cargoItem?.seq, "width")}
              label="width"
              value={cargoItem?.width}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("width"),type:"number" }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_height`}
              id={getID(index, cargoItem?.seq, "height")}
              label="height"
              value={cargoItem?.height}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("height"),type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_weight`}
              id={getID(index, cargoItem?.seq, "weight")}
              label="weight"
              value={cargoItem?.weight}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("weight"),type:"number" }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_soc`}
              id={getID(index, cargoItem?.seq, "soc")}
              label="soc"
              value={cargoItem?.soc}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("soc") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_empty`}
              id={getID(index, cargoItem?.seq, "empty")}
              label="empty"
              value={cargoItem?.empty}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("empty") }}
              width="w-24"
            />
             <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_temp`}              
              id={getID(index, cargoItem?.seq, "temp")}
              label="temp"
              value={cargoItem?.temp}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("temp"),type:"number" }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_vent`}
              id={getID(index, cargoItem?.seq, "vent")}
              label="vent"
              value={cargoItem?.vent}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("vent") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_un_no`}
              id={getID(index, cargoItem?.seq, "un_no")}
              label="un_no"
              value={cargoItem?.un_no}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("un_no") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_class`}
              id={getID(index, cargoItem?.seq, "class")}
              label="class"
              value={cargoItem?.class}
              events={{ onChange: onChange }}
              options={{isReadOnly : !handleFieldReadOnly("class") }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_volume_factor`}
              id={getID(index, cargoItem?.seq, "volume_factor")}
              label="volume_factor"
              value={cargoItem?.volume_factor}
              events={{ onChange: onChange }}
              options={{ isReadOnly :  true,type:"number" }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_commodity_cd`}
              id={getID(index, cargoItem?.seq, "commodity_cd")}
              label="commodity_cd"
              value={cargoItem?.commodity_cd}
              events={{ onChange: onChange }}
              options={{ isReadOnly :  true }}
              width="w-24"
            />
            <MaskedInputField
              //key={`${index}_${bkData?.cargo?.seq}_hs_cd`}
              id={getID(index, cargoItem?.seq, "hs_cd")}
              label="hs_cd"
              value={cargoItem?.hs_cd}
              events={{ onChange: onChange }}
              options={{ isReadOnly :  true }}
              width="w-24"
            />
          </div>
        </div>
      </>
    );
  }
);

const CargoLCL = memo(
  ({
    loadItem,
    cargoItem,
    index,
    // isRefreshCargo,
    onPieceChange,
    onDelete,
    onValueChange,
    onChange
  }: Props) => {

    const [pkgtype, setPkgtype] = useState<any>()
    const [grossuom, setGrossuom] = useState<any>()
    const [measurementuom, setMeasurementuom] = useState<any>()


    useEffect(() => {
      if (loadItem?.length) {
        setPkgtype(loadItem[22])
        setGrossuom(loadItem[24])
        setMeasurementuom(loadItem[25])

      }
    }, [loadItem?.length]);



    return (
      <>
        <div className="flex-row w-full">
          <div className="flex flex-wrap">
            <InputWrapper outerClassName="pt-4" inline={false}>
              <Button
                id={cargoItem?.seq}
                onClick={() => onDelete(cargoItem?.seq)}
                size="20"
                label="delete"
                isLabel={false}
              />
            </InputWrapper>
            
            <MaskedInputField
              id={getID(index, cargoItem?.seq, "piece")}
              label="piece"
              value={cargoItem?.piece}
              events={{ onChange: onChange }}
              options={{ type:"number" }}
              width="w-24"
            />

              <div className="flex w-32">              
              <CustomSelect
                id={getID(index, cargoItem?.seq, "pkg_type")}
                label="pkg_type"
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
                defaultValue={cargoItem?.pkg_type}
                inline={false}
              />
            </div>


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
              id={getID(index, cargoItem?.seq, "length")}
              label="length"
              value={cargoItem?.length}
              events={{ onChange: onChange }}
              options={{type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              id={getID(index, cargoItem?.seq, "width")}
              label="width"
              value={cargoItem?.width}
              events={{ onChange: onChange }}
              options={{type:"number" }}
              width="w-24"
            />
             <MaskedInputField
              id={getID(index, cargoItem?.seq, "height")}
              label="height"
              value={cargoItem?.height}
              events={{ onChange: onChange }}
              options={{type:"number" }}
              width="w-24"
            />           
            <MaskedInputField
              id={getID(index, cargoItem?.seq, "weight")}
              label="weight"
              value={cargoItem?.weight}
              events={{ onChange: onChange }}
              options={{type:"number" }}
              width="w-24"
            />
            <MaskedInputField
              id={getID(index, cargoItem?.seq, "gross_wt")}
              label="gross_wt"
              value={cargoItem?.gross_wt}
              events={{ onChange: onChange }}
              options={{type:"number"}}
              width="w-24"
            />
              <div className="flex w-28">
              <CustomSelect
                id={getID(index, cargoItem?.seq, "gross_uom")}
                label="gorss_uom"
                initText="Select.."
                listItem={grossuom as gridData}
                valueCol={["gross_uom", "gross_uom_nm"]}
                displayCol="gross_uom"
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
                defaultValue={cargoItem?.gross_uom}
                inline={false}
              />
            </div>

            <MaskedInputField
              id={getID(index, cargoItem?.seq, "measurement")}
              label="measurement"
              value={cargoItem?.measurement}
              events={{ onChange: onChange }}
              options={{type:"number" }}
              width="w-24"
            />
            {/* selectbox 수정예정 */}
            <div className="flex w-28">              
              <CustomSelect
                id={getID(index, cargoItem?.seq, "measurement_uom")}
                initText="Select.."
                listItem={measurementuom as gridData}
                valueCol={["measurement_uom", "measurement_uom_nm"]}
                displayCol="measurement_uom"
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
                defaultValue={cargoItem?.measurement_uom}
                inline={false}
              />
            </div>

          </div>
        </div>
      </>
    );
  }
);

const getID = (index:number, seq:number, col:string) => {
  return `${col}-${index}_${seq}`;
}

export default CargoDetailRow;
