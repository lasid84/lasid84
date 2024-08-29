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
};

const CargoDetail: React.FC<Props> = memo(({ initData, bkData, isRefreshCargo }) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab } = objState;

  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);

  var initialCargo = {
    bk_id: bkData?.bk_id,
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
    __changed : false, //NEW      
    };

  const {
    data: cargoData,
    refetch: cargoRefetch,
    remove: cargoRemove,
  } = useGetData(
    { bk_no: objState?.MselectedTab },
    SEARCH_CGD,
    SP_GetCargoData,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (cargoData) {
      const updatedCargo = Array.isArray(cargoData) && cargoData.length > 0
      ? cargoData
      : [initialCargo];
      log('getCargoData',updatedCargo)
      dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargo } });
    }
  }, [cargoData]);



const handlePieceChange = (seq: number, pieceCount: number, index: number) => {
  log('handlePieceChange..........', bkData?.cargo, seq, pieceCount, index);

  // 기존 cargo 리스트에서 seq가 동일한 항목들을 제거하고, 새로운 항목들을 추가
  const updatedCargoList = bkData.cargo.reduce((acc: any, item: any, i: any) => {
      if (i === index) {
          item.piece = 1;
          acc.push(item);

          const maxSeq = Math.max(...bkData.cargo.map((item: any) => item.seq)); 
          const newCargoItems = Array.from({ length: pieceCount - 1 }, (_, j) => ({
              ...initialCargo,
              seq: maxSeq + j + 1,
              container_type: bkData.cargo[index]?.container_type,
              piece: 1, 
          }));
          acc.push(...newCargoItems);
      } else {
          acc.push(item);
      }
      return acc;
  }, [] as Cargo[]);

  // 업데이트된 cargo 리스트를 상태에 반영
  dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
 // 강제로 리렌더링 (optional)
 setTimeout(() => {
  dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
}, 0);
};


  const handleChange = (seq: number,id:string, value: string, index : number) => {
    log('handleChange..........',seq,id,value,index ) 
    const updatedCargoList = bkData?.cargo.map((item: any, i: number) => {
      return i == index ? { ...item, [id]: value } : item
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
      const newCargo = { ...initialCargo, seq: maxSeq+1 }; //nextSeq
      const newCargoList = bkData.cargo ? [...bkData.cargo, newCargo] : [newCargo];
      dispatch({ [MselectedTab]: { ...bkData, cargo: newCargoList } });
    }
  };

  const handleDelete = (seq: number) => {
    if (bkData && bkData.cargo) {
      const updatedCargoList = bkData.cargo.filter((item: any) => item.seq !== seq);
      dispatch({ [MselectedTab]: { ...bkData, cargo: updatedCargoList } });
    }
  };

  const onSave = () => {
    var hasData = false
    if (bkData?.cargo) {
      bkData.cargo.forEach((item: Cargo) => {
        log('item check', item)
        // 변경된 항목인지 확인
        if (item.__changed) {
          hasData = true;}})

    }
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
        {bkData?.cargo?.map((cargoItem: any, i: any) =>
          bkData?.svc_type === "LCL" ? (
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
        )}
      </div>
    </PageBKCargo>
  );
});

export default CargoDetail;