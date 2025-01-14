"use client";

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from "components/input";
import {
  SEARCH_MD,
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import CustomSelect from "components/select/customSelect";
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import CargoDetail from "./cargoDetail"

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  loadItem: any[];
  bkData: any
};

const BKCargo = memo(({ loadItem, bkData }: Props) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab, mSelectedRow, popType, mSelectedCargo } =
    objState;

  //Set select box data
  const [svctype, setSvcType] = useState<any>();
  const [movementtype, setMovementType] = useState<any>();
  //const [selectedSvcType, setSelectedSvcType] = useState<string | undefined>();
  const [ isRefreshCargo, setRefreshCargo ] = useState(false);
  
  useEffect(() => {
    if (loadItem) {
      setSvcType(loadItem[5]);
      setMovementType(loadItem[6]);
      //setSelectedSvcType(bkData?.svc_type); 
    }
  }, [loadItem]); //bkData

  return (
    <div className="flex-row w-full">
      <PageContent
        title={
          <span className="px-1 py-1 text-lg font-bold text-blue-500">
            Cargo
          </span>
        }
      >

        <div className={"col-span-1"}>
          <CustomSelect
            id="svc_type"
            initText='Select a BL Type'
            listItem={svctype as gridData}
            valueCol={["svc_type", "svc_type_nm",]}
            displayCol="svc_type_nm"
            gridOption={{colVisible: { col: ["svc_type_nm"], visible: true },}}
            gridStyle={{ width: '320px', height: '200px' }}
            style={{ width: '500px', height: "8px" }}
            defaultValue={bkData?.svc_type}
            isDisplay={true}
            //onChange={(value: string) => setSelectedSvcType(value)}
            events={{
              onSelectionChanged: (e, id, value)=> {
                if(bkData?.svc_type != value) {
                  var selectedRow = e.api.getSelectedRows()[0] as any;   
                  bkData = {
                    ...bkData,
                    cargo: bkData.cargo.map((row:any) => {
                      return {
                        ...row, 
                        use_yn :'N',
                        [ROW_CHANGED]:true
                      }
                    })
                  };         
                  // log("svc_type onSelectionChanged", bkData);
                  dispatch({
                    [MselectedTab] : {
                      ...bkData,
                      svc_type : value,
                      svc_type_nm : value,
                      [ROW_CHANGED]:true
                    }});
                // setRefreshCargo(true);
                }
                /* TODO */
                //CARGO 객체 초기화 로직 필요?                
                // if(bkData?.svc_type ==='LCL'){
                // }
              }
            }}
          />
        </div>

       
        <div className={"col-span-1"}>
          <CustomSelect
            id="movement_type"
            initText='Select a Movement Type'
            listItem={movementtype as gridData}
            valueCol={["movement_type", "movement_nm"]}
            displayCol="movement_nm"
            gridOption={{
              colVisible: { col: ["movement_type", "movement_nm"], visible: true },
            }}
            gridStyle={{ width: '320px', height: '200px' }}
            style={{ width: '500px', height: "8px" }}
            defaultValue={bkData?.movement_type}
            isDisplay={true}
          />
        </div>        
        <MaskedInputField id="commodity" value={bkData?.commodity} options={{ isReadOnly: false }} />
      </PageContent>

      <div className="flex flex-row w-full">
        <div className="flex w-full">
          <PageContent
            title={
              <span className="px-1 py-1 text-lg font-bold text-blue-500">Cargo Detail</span>
            }>
            <div className="col-span-6">
              <CargoDetail initData={loadItem}  bkData={objState[MselectedTab]} /*isRefreshCargo={isRefreshCargo}*//>
            </div>
          </PageContent>
        </div>
      </div>
      <PageContent
        title={<></>}
      >
        <div className="col-start-1 col-end-6 ">
          <TextArea id="cargo_remark" rows={8} cols={32} value={bkData?.cargo_remark} options={{ isReadOnly: false }} />
        </div>
      </PageContent>
    </div>
  );
});

export default BKCargo;
