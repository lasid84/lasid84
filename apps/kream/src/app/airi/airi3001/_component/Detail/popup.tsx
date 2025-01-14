import DialogBasic from "layouts/dialog/dialog";
import {
  Controller,
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
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
import {
  gridData,
  ROW_CHANGED,
  ROW_TYPE,
  ROW_TYPE_NEW,
} from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/badge";
import { Store } from "../../_store/store";
import DetailGrid from "./popupGrid";

import { log } from '@repo/kwe-lib-new';

type Callback = () => void;
type Props = {
  loadItem: any[] | null;
  callbacks?: Callback[];
};

// const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
const Modal = ({ loadItem }: Props) => {
  const { t } = useTranslation();
  const detail: any[] = [];

  const { getValues,  reset, setFocus, } =  useFormContext();
  const mainSelectedRow = Store((state)=>state.mainSelectedRow)
  const popup = Store((state)=>state.popup)
  const state = Store((state)=>state)
  const actions = Store((state)=>state.actions)


  const closeModal = async () => {
    actions.updatePopup({
      popType: 'U',
      isPopupOpen: false,
    });
  };

  //Set select box data
  const [incoterms, setIncoterms] = useState<any>();
  useEffect(() => {
    if (loadItem) {
      setIncoterms(loadItem[2]);
    }
  }, [loadItem]);

  useEffect(() => {
    if (loadItem && mainSelectedRow && Object.keys(mainSelectedRow).length > 0) {
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
    const allColumns = state.detailDatas
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
    console.log('curData', curData, state.popup.popType)
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
    <DialogBasic
      isOpen={state.popup.isPopupOpen!}
      onClose={closeModal}
      title={t("MSG_0185") + (state.popup.popType === crudType.CREATE ? "등록" : "수정")}
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
                <MaskedInputField
                  id="invoice_no"
                  value={mainSelectedRow?.invoice_no}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="invoice_dd"
                  value={mainSelectedRow?.invoice_dd}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>

              <MaskedInputField
                id="portent"
                value={mainSelectedRow?.portent}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="shippername"
                value={mainSelectedRow?.shippername}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="soldto"
                value={mainSelectedRow?.soldto}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="grosswt"
                  value={mainSelectedRow?.grosswt}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="grossunit"
                  value={mainSelectedRow?.grossunit}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="netwt"
                  value={mainSelectedRow?.netwt}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="netunit"
                  value={mainSelectedRow?.netunit}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="measurement"
                  value={mainSelectedRow?.measurement}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="measureunit"
                  value={mainSelectedRow?.measureunit}
                  options={{
                    isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
            </div>
            <div className="col-span-2 p-4 ">
              <MaskedInputField
                id="declnum"
                value={mainSelectedRow?.declnum}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="mwb_no"
                value={mainSelectedRow?.mwb_no}
                options={{
                  isReadOnly: false,
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="exrate"
                  value={mainSelectedRow?.exrate}
                  options={{
                    isReadOnly: false,
                  }}
                />
                <div className={"col-span-1"}>
                  <CustomSelect
                    id="incoterms"
                    initText="Select a Incoterms"
                    listItem={incoterms as gridData}
                    valueCol={["incoterms", "incoterms_nm"]}
                    displayCol="incoterms_nm"
                    gridOption={{
                      colVisible: { col: ["incoterms_nm"], visible: true },
                    }}
                    gridStyle={{ width: "220px", height: "200px" }}
                    style={{ width: "500px", height: "8px" }}
                    defaultValue={mainSelectedRow?.incoterms}
                    isDisplay={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="decldate"
                  value={mainSelectedRow?.decldate}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                <MaskedInputField
                  id="decltime"
                  value={mainSelectedRow?.decltime}
                  options={{
                    isReadOnly: false,
                    type: "time",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="ccdate"
                  value={mainSelectedRow?.ccdate}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                <MaskedInputField
                  id="cctime"
                  value={mainSelectedRow?.cctime}
                  options={{
                    isReadOnly: false,
                    type: "time",
                  }}
                />
              </div>
              <MaskedInputField
                id="totaldeclvalue"
                value={mainSelectedRow?.totaldeclvalue}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="totaldeclfltvalue"
                value={mainSelectedRow?.totaldeclfltvalue}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="totaldeclinsvalue"
                value={mainSelectedRow?.totaldeclinsvalue}
                options={{
                  isReadOnly: false,
                }}
              />
            </div>
            <div className="col-span-2 p-4 ">
              <MaskedInputField
                id="receivedatetime"
                value={mainSelectedRow?.receivedatetime}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="updatetime"
                value={mainSelectedRow?.updatetime}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="senddatetime"
                value={mainSelectedRow?.senddatetime}
                options={{
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
            </div>
            <div className="col-span-2 p-6 ">
              <Badge
                size={"md"}
                name={mainSelectedRow?.status_name}
                color="border-sky-500 text-sky-500"
                rounded
                outlined
              />
            </div>
          </div>
          <div className="h-full col-span-3">
            <DetailGrid
              params={{
                waybill_no: mainSelectedRow?.waybill_no,
                invoice_no: mainSelectedRow?.invoice_no,
              }}
            />
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
