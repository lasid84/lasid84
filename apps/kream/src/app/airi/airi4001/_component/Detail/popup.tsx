import DialogBasic, {DialogArrow} from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  memo,
  MouseEventHandler,
} from "react";
import {
  crudType,
  SEARCH_M,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/badge";
import { Store } from "../../_store/store";
// import PopupWithArrows from "@/components/popupArrows/index"
import Amount from "./popupAmount";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem: any[] | null;
  callbacks?: Callback[];
  // onLeftArrowClick: () => void;
  // onRightArrowClick: () => void; 
};

// const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
const Modal = ({ loadItem }: Props) => {
  const { t } = useTranslation();
  const detail: any[] = [];

  const { getValues, reset, setFocus } = useFormContext();
  const mainSelectedRow = Store((state) => state.mainSelectedRow);
  const popup = Store((state) => state.popup);
  const state = Store((state) => state);
  const actions = Store((state) => state.actions);

  const closeModal = async () => {
    actions.updatePopup({
      popType: "U",
      isPopupOpen: false,
    });
  };

  //Set select box data
  const [incoterms, setIncoterms] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem) {
      setIncoterms(loadItem[1]);
      setCustcode(loadItem[1]);
    }
  }, [loadItem]);

  useEffect(() => {
    if (
      loadItem &&
      mainSelectedRow &&
      Object.keys(mainSelectedRow).length > 0
    ) {
    }
  }, [mainSelectedRow, loadItem]);

  useEffect(() => {
    reset();
    if (state.popup.popType === crudType.CREATE) {
      setFocus("use_yn");
    }
  }, [state.popup.popType, state.popup.isOpen]);

  const SaveDetail = async () => {
    let hasData = false;
    // const allColumns = state.gridRef_Detail?.current?.api.getAllGridColumns();
    const allColumns = state.detailDatas;
    log("saveDetail? allColumns", allColumns);
    // await state.gridRef_Detail.current.api.forEachNode((node: any) => {
    //   if (node.data[ROW_CHANGED]) {
    //     hasData = true;
    //     var data = {
    //       ...node.data,
    //     };
    //     log("data", data);
    //     detail.push(data);
    //   }
    // });

    return hasData;
  };

  const onSave = async (param: MouseEventHandler | null) => {
    let hasDetailData = await SaveDetail();
    let curData = getValues();
    console.log("curData", curData, state.popup.popType);
    if (state.popup.popType === crudType.UPDATE) {
      if (hasDetailData) {
        // await Update.mutateAsync(
        //   { ...curData, jsonData: JSON.stringify(detail) },
        //   {
        //     onSuccess: (res: any) => {
        //       //closeModal();
        //       //dispatch({ isMSearch: true });
        //     },
        //   }
        // ).catch((err) => {});
        // await actions.updateAppleDatas({...curData, jsonData : JSON.stringify(state.detailDatas)})
      }
    }
  };

  
  return (
    <>
    <div className="">

    
    <DialogArrow
      isOpen={state.popup.isPopupOpen!}
      onClose={closeModal}
      title={
        t("MSG_0192") +
        (state.popup.popType === crudType.CREATE ? "등록" : "수정")
      }
      bottomRight={
        <>
          <Button id={"save"} onClick={onSave} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-full p-1 border rounded-lg">
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
                  <CustomSelect
                    id="shipper_id"
                    initText="Select a Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: {
                        col: ["cust_code", "cust_nm", "bz_reg_no"],
                        visible: true,
                      },
                    }}
                    gridStyle={{ width: "600px", height: "300px" }}
                    style={{ width: "1000px", height: "8px" }}
                    isDisplay={true}
                    defaultValue={mainSelectedRow?.cnee_id}
                    // inline={true}
                  />
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
              </div>
            </div>
            <div className="col-span-2 p-4 ">
              <div className="grid grid-cols-2 gap-1">
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
          <div className="w-full col-span-3 40vh">            
           <Amount loadItem={loadItem}/>
          </div>
        </div>
      </form>
    </DialogArrow>
    
    </div>
    </>
  );
};

export default Modal;
