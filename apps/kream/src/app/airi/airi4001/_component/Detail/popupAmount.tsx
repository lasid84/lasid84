"use client";

import { useFormContext } from "react-hook-form";
import {
  useRef,
  useEffect,
} from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/badge";
import { Store } from "../../_store/store";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Amount: React.FC<Props> = ({  loadItem, params }) => {
  const gridRef = useRef<any | null>();
  const { objState } = useAppContext();  
  const mainSelectedRow = Store((state) => state.mainSelectedRow);
  const popup = Store((state) => state.popup);
  const state = Store((state=>state));
  const actions = Store((state)=>state.actions);


  useEffect(() => {
    if (gridRef?.current){
      //console.log('gridRef.current', gridRef.current)
      //  actions.setState({ gridRef_Detail: gridRef.current?.api });
    }      
  }, [gridRef.current])



  useEffect(() => {
    if (objState.isDSearch) {
      //   CarrierContRefetch();
      // log("grid Data?", EDIDetailData);
      // EDIDetailRefetch();
      // dispatch({ isDSearch: false });

       const fetchDataAsync = async() => {
        // const {data: newData } = await EDIDetailRefetch();
        // const detail = (newData as string[])[1]? ((newData as string[])[1] as gridData).data : [];
        // log('grid Data??? - detail', detail, newData)
      }
      fetchDataAsync()
    }
  }, [objState.isDSearch]);


  return (
    <>
      <div className="w-full gap-4 30vh md:gap-8">
          <div className="flex w-full h-full p-1 border rounded-lg">
            <div className="col-span-2 p-4">
              <MaskedInputField
                id="waybill_no"
                value={mainSelectedRow?.waybill_no}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className={"col-span-2"}>
                 
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="invoice_no"
                  value={mainSelectedRow?.invoice_no}
                  options={{
                    isReadOnly:
                      popup.popType === crudType.CREATE ? false : true,
                  }}
                />
                <DatePicker
                  id="invoice_dd"
                  value={mainSelectedRow?.invoice_dd}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                {/* BL구분 : O-KWE, T-타사BL */}
                <MaskedInputField
                  id="total_chargeable_weight"
                  value={mainSelectedRow?.total_chargeable_weight}
                  options={{
                    isReadOnly:
                      popup.popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
            </div>
            <div className="col-span-2 p-4 ">
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="settlement_date"
                  value={mainSelectedRow?.settlement_date}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                <DatePicker
                  id="eta"
                  value={mainSelectedRow?.eta}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                  }}
                />
                <DatePicker
                  id="create_date"
                  value={mainSelectedRow?.create_date}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                    isReadOnly : true
                  }}
                />
                <MaskedInputField
                  id="create_user"
                  value={mainSelectedRow?.create_user}
                  options={{
                    inline: false,
                    textAlign: "center",
                    isReadOnly : true
                  }}
                />
                <DatePicker
                  id="update_date"
                  value={mainSelectedRow?.update_date}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                    isReadOnly : true
                  }}
                />
                <MaskedInputField
                  id="update_user"
                  value={mainSelectedRow?.update_user}
                  options={{
                    isReadOnly : true,
                    textAlign: "center",
                  }}
                />
              </div>
              <MaskedInputField
                id="total"
                value={mainSelectedRow?.total}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
            </div>
            <div className="col-span-2 p-6 ">
              <Badge
                size={"md"}
                name={mainSelectedRow?.status}
                color="border-sky-500 text-sky-500"
                rounded
                outlined
              />
            </div>
          </div>
          <div className="h-full col-span-3">
            {/* 구AICMS UI로 컴포넌트 생성 필요 */}
            
          </div>
        </div>
    </>
  );
};

export default Amount;
