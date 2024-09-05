"use client";

import { useRef, memo, useEffect, useState } from "react";
import type { gridData } from "components/grid/ag-grid-enterprise";
import { PageBKCargo } from "layouts/search-form/page-search-row";
import { SP_GetCargoData } from "./data";
import { SEARCH_CGD } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { toastSuccess } from "components/toast";
import { SP_InsertCargo, SP_UpdateCargo } from "./data";
import CargoDetailRow from "./cargoDetailRow"
const { log, error } = require("@repo/kwe-lib/components/logHelper");
import { ROW_CHANGED, ROW_TYPE, ROW_TYPE_NEW } from 'components/grid/ag-grid-enterprise';


type Props = {
  initData?: any | null;
  bkData: any;
  isRefreshCargo?: boolean;
};

export type Cargo = {
  bk_id: string;
  seq: number;
  container_type: string;
  piece: number;
  pkg_type: string;
  container_refno: string;
  seal_no: string;
  stc_uom: string;
  gross_uom: string;
  measurement: string;
  measurement_uom: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  soc: string;
  empty: string;
  vent: string;
  un_no: string;
  class: string;
  description: string;
  [ROW_CHANGED] : boolean;
  [ROW_TYPE] : string;  
};
export const initialCargo = {
  // bk_id: '', //bkData?.bk_id
  // container_type: "",
  piece: 1,
  // same: false, //상태type
  // pkg_type: "",
  // container_refno: "",
  // seal_no: "",
  // slac_stc: 0,
  // stc_uom: "",
  // gross_wt: 0,
  // gross_uom: "",
  // measurement: "",
  // measurement_uom: "",
  // // dg_yn: false,
  // length: 0,
  // width: 0,
  // height: 0,
  // weight: 0,
  // soc: "",
  // empty: "",
  // temp: 0,
  // vent: "",
  // un_no: "",
  // class: "",
  // description: "",
  use_yn : "Y",
  [ROW_CHANGED] : true,
  [ROW_TYPE] : ROW_TYPE_NEW //NEW   
  };

const CargoDetail: React.FC<Props> = memo(({ initData, bkData, isRefreshCargo }) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab } = objState;

  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);


const handlePieceChange = (seq: number, pieceCount: number, index: number) => {
  log('handlePieceChange..........', bkData?.cargo, seq, pieceCount, index);

  // 그룹으로 기존 항목 필터링 (기존에 seq와 동일한 group 값을 가진 cargo 들을 제거)
  const filteredCargoList = bkData.cargo.filter((item: any) => item.group !== seq || item.seq === seq);

//   // var count = filteredCargoList.length;
//   // while (count < pieceCount) {
//   //   filteredCargoList.push({
//   //     ...initialCargo, 
//   //     container_type: bkData.cargo[index]?.container_type,
//   //     piece : null,
//   //     isHandlePieceChange: true, // 플래그 추가
//   //   });
//   // }
//   // filteredCargoList.filter((_:any,i:number) => i <= pieceCount);

log('handlePieceChange filteredCargoList..........', filteredCargoList);

  const updatedCargoList = filteredCargoList.reduce((acc:any, item:any, i:any) => {
    acc.push(item);
    if (i === index) {
        item.piece = pieceCount;
        acc.push(item);
        const maxSeq = Math.max(...bkData.cargo.map((item: any) => item.seq)); // 최대 seq 값 찾기
        const newCargoItems = Array.from({ length: pieceCount - 1 }, (_, j) => ({
            ...initialCargo,
            bk_id:bkData?.bk_id,
            container_type: item.container_type,
            group: seq, //group index를 생성
            piece : null,
            isHandlePieceChange: true, // 플래그 추가
            use_yn : 'Y',            
        }));
        acc.push(...newCargoItems);
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as Cargo[]);

  log('handlePieceChange2222..........', updatedCargoList);

  dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
};



  const handleChange = (seq: number,id:string, value: string, index : number) => {
    log('handleChange..........',seq,id,value,index ) 
    const replaced_id = id.split("-")[0]
    const updatedCargoList = bkData?.cargo.map((item: any, i: number) => {
      return item.seq === seq ? { ...item, [replaced_id]: value,  [ROW_CHANGED] : true } : item;
    }
    );
    //log('handleChange...updatedCargoList', updatedCargoList)
    dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });

  }


  const onAdd = () => {
    if (bkData) {
      const maxSeq = bkData.cargo && bkData.cargo.length > 0
      ? Math.max(...bkData.cargo.map((item: any) => item.seq || 0)) + 1 // 현재 최대 seq 값 찾기
      : 1;
      
      const newCargo = { ...initialCargo,  bk_id:bkData?.bk_id, seq: maxSeq};
      const newCargoList = bkData.cargo ? [...bkData.cargo, newCargo] : [newCargo]
      log("newCargoList", newCargoList);
      dispatch({ [MselectedTab]: { ...bkData, cargo: newCargoList } });
    }
  };


  //delete -> use_yn ='N'
  const handleDelete = (seq: number) => {
    if (bkData && bkData.cargo) {

      log("updatedCargoList111", bkData.cargo, seq)
        // BKDATA.CARGO 객체 내 __ROWTYPE KEY가 존재하고, 'NEW'면 필터링처리, __ROWTYPE KEY가 존재하지않으면
        // DB에 존재하는 데이터이므로 use_yn ='N'업데이트 처리 하고 updatedCargoList 에 남아있어야함.           
        const updatedCargoList = bkData.cargo.map((item: any) => {
          if (item.seq === seq || (item.group && (item.group === seq))) {  
              log("in map", item)            
              if(item[ROW_TYPE] && item[ROW_TYPE] === ROW_TYPE_NEW){ 
                //브라우저상에서만 생성된 CARGO 객체(DB저장X상태)는 리스트에서 제거, 반대의 경우 use_yn='N'업데이트
                return null 
              }else {
                 return {...item, use_yn:'N', [ROW_CHANGED]:true}
              }
          } return item;
        })
        log("updatedCargoList2", updatedCargoList)
        dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList.filter((arr: any) => arr) } });
      }      
    
  };

  const onSave = () => {
    log('onSave.................',bkData?.cargo)
    const processNodes = async () => {
      if (bkData?.cargo) {
        bkData.cargo.forEach( async (data: Cargo) => {
          if (data.__changed) {
            try{
              if (data.__ROWTYPE === ROW_TYPE_NEW) {
                await Create.mutateAsync(data);
              } else {          //수정
                await Update.mutateAsync(data);
              }   
            }catch(error){
              log("error:", error);
            }finally{
              data.__changed = false;
            }            
          }
        })        
      }
      //toastSuccess("Success.")
    }    
    processNodes()
    .then(() => {
      toastSuccess("Success.")
      //dispatch({ isDSearch: true }); //maindata refetch?
    })
    .catch((error) => {
      log("node. Error", error);
    });
  }

  

  return (
    <PageBKCargo
      right={
        <>
          <Button id="add" onClick={onAdd} width="w-15" label="Add" />
          <Button id="save" onClick={onSave} width="w-15" label="Save" />
        </>
      }
    >
      
      <div className="flex-row w-full">
        {/* { bkData?.cargo?.filter((cargoItem: any) => cargoItem?.use_yn && cargoItem.use_yn === 'Y').map((cargoItem: any, i: any) => { */}
        { bkData?.cargo?.map((cargoItem: any, i: any) => {
            if (cargoItem.use_yn !== 'Y') return;

            return  (
            <CargoDetailRow
              key={i}
              index={i}
              loadItem={initData}
              svc_type={bkData?.svc_type}
              cargoItem={cargoItem}
              // isRefreshCargo={isRefreshCargo}
              onDelete={handleDelete}
              onPieceChange={handlePieceChange}
              onValueChange={handleChange}
              />
            )})}              
        </div>
    </PageBKCargo>
    );
});

export default CargoDetail;