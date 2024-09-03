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
import CargoFCL, {CargoLCL} from "./cargoDetailRow"
const { log, error } = require("@repo/kwe-lib/components/logHelper");
import { ROW_TYPE_NEW } from 'components/grid/ag-grid-enterprise';

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
  __changed : boolean;
  __ROWTYPE : string;  
};
export const initialCargo = {
  bk_id: '', //bkData?.bk_id
  seq: -1,
  container_type: "",
  piece: 1,
  // same: false, //상태type
  pkg_type: "",
  container_refno: "",
  seal_no: "",
  slac_stc: 0,
  stc_uom: "",
  gross_wt: 0,
  gross_uom: "",
  measurement: "",
  measurement_uom: "",
  // dg_yn: false,
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  soc: "",
  empty: "",
  temp: 0,
  vent: "",
  un_no: "",
  class: "",
  description: "",   
  __changed : true,
  __ROWTYPE : ROW_TYPE_NEW //NEW
   
  };

const CargoDetail: React.FC<Props> = memo(({ initData, bkData, isRefreshCargo }) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab } = objState;

  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);

  
  // const {
  //   data: cargoData,
  //   refetch: cargoRefetch,
  //   remove: cargoRemove,
  // } = useGetData(
  //   { bk_no: objState?.MselectedTab },
  //   SEARCH_CGD,
  //   SP_GetCargoData,
  //   {
  //     enabled: true,
  //   }
  // );



const handlePieceChange = (seq: number, pieceCount: number, index: number) => {
  //log('handlePieceChange..........', bkData?.cargo, seq, pieceCount, index);

  // 그룹으로 기존 항목 필터링 (기존에 seq와 동일한 group 값을 가진 cargo 들을 제거)
  const filteredCargoList = bkData.cargo.filter((item: any) => item.group !== seq);

  const updatedCargoList = filteredCargoList.reduce((acc:any, item:any, i:any) => {
    acc.push(item);
    if (i === index) {
        const maxSeq = Math.max(...bkData.cargo.map((item: any) => item.seq)); // 최대 seq 값 찾기
        const newCargoItems = Array.from({ length: pieceCount - 1 }, (_, j) => ({
            ...initialCargo,
            bk_id:bkData?.bk_id,
            seq: maxSeq + j + 1, // 새로운cargo의 seq는 기존 최대 값보다 큰 값으로 설정
            container_type: bkData.cargo[index]?.container_type,
            group: seq, //group index를 생성
            piece : null,
            isHandlePieceChange: true, // 플래그 추가
        }));
        acc.push(...newCargoItems);
    }
    return acc;
}, [] as Cargo[]);

  dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
};



  const handleChange = (seq: number,id:string, value: string, index : number) => {
    //log('handleChange..........',seq,id,value,index ) 
    const updatedCargoList = bkData?.cargo.map((item: any, i: number) => {
      return i == index ? { ...item, [id]: value,  __changed : true, } : item
    }
    );
    //log('handleChange...updatedCargoList', updatedCargoList)
    dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });

  }


  const handleonClick = () => {
    if (bkData) {
      const maxSeq = bkData.cargo && bkData.cargo.length > 0
      ? Math.max(...bkData.cargo.map((item: any) => item.seq)) // 현재 최대 seq 값 찾기
      : 0;
      const newCargo = { ...initialCargo,bk_id:bkData?.bk_id, seq: maxSeq+1 } 
      const newCargoList = bkData.cargo ? [...bkData.cargo, newCargo] : [newCargo]
      dispatch({ [MselectedTab]: { ...bkData, cargo: newCargoList } });
    }
  };


  const handleDelete = (seq: number) => {
    if (bkData && bkData.cargo) {
      if(bkData.svc_type === "FCL"){
        const updatedCargoList = bkData.cargo.filter((item: any) =>   {
          return (item.group && item.group !== seq) || (!item.group && item.seq !== seq) 
        })
        dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
      }else{
        const updatedCargoList = bkData.cargo.filter((item: any) =>   {
          return item.seq !== seq 
        })
        dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
      }      
    }
  };

  const onSave = () => {
    //log('onSave.................',bkData?.cargo)
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
          <Button id="add" onClick={handleonClick} width="w-15" label="Add" />
          <Button id="save" onClick={onSave} width="w-15" label="Save" />
        </>
      }
    >
      
      <div className="flex-row w-full">
        {bkData?.cargo && bkData?.cargo?.map((cargoItem: any, i: any) => {
            return bkData?.svc_type === "LCL" ? (
            <CargoLCL
              key={i}
              index={i}
              loadItem={initData}
              bkData={{ cargo: cargoItem }}
              isRefreshCargo={isRefreshCargo}
              onDelete={handleDelete}
              onPieceChange={handlePieceChange}
              onValueChange={handleChange}
              />
              ) : (
                <CargoFCL
                key={i}
                index={i}
                loadItem={initData}
                bkData={{ cargo: cargoItem }}
                isRefreshCargo={isRefreshCargo}
                onDelete={handleDelete}
                onPieceChange={handlePieceChange}
                onValueChange={handleChange}
                />
                )
              })}              
                </div>
                </PageBKCargo>
                );
});

export default CargoDetail;