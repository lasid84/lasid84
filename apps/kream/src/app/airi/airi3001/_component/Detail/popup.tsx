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
import { SP_UpdateData } from "../data";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import CustomSelect from "components/select/customSelect";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/badge";
import DetailGrid from "./popupGrid";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem: any[] | null;
  callbacks?: Callback[];
};

// const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
const Modal = ({ loadItem }: Props) => {
  const { dispatch, objState } = useAppContext();
  const { popUp, mSelectedRow, gridRef_Detail } = objState;
  const { crudType: popType, isPopUpOpen: isOpen } = popUp;

  const { t } = useTranslation();
  const detail: any[] = [];
  //const { Create } = useUpdateData2(SP_InsertCustData);
  const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    dispatch({
      isPopUpOpen: false,
      popUp: { ...popUp, isPopUpOpen: false },
      mSelectedRow: { ...mSelectedRow, ...getValues() },
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
    if (loadItem && mSelectedRow && Object.keys(mSelectedRow).length > 0) {
    }
  }, [mSelectedRow, loadItem]);

  useEffect(() => {
    reset();
    if (popType === crudType.CREATE) {
      setFocus("use_yn");
    }
  }, [popType, isOpen]);

  const SaveDetail = async () => {
    let hasData = false;
    const allColumns = gridRef_Detail?.current?.api.getAllGridColumns();
    log("saveDetail? allColumns", allColumns);
    await gridRef_Detail.current.api.forEachNode((node: any) => {
      if (node.data[ROW_CHANGED]) {
        hasData = true;
        var data = {
          ...node.data,
        };
        log("data", data);
        detail.push(data);
      }
    });
    return hasData;
  };

  const onSave = async (param: MouseEventHandler | null) => {
    let hasDetailData = await SaveDetail();
    let curData = getValues();
    if (popType === crudType.UPDATE) {
      if (hasDetailData) {
        await Update.mutateAsync(
          { ...curData, jsonData: JSON.stringify(detail) },
          {
            onSuccess: (res: any) => {
              //closeModal();
              //dispatch({ isMSearch: true });
            },
          }
        ).catch((err) => {});
      }
    }
  };

  return (
    <DialogBasic
      isOpen={isOpen!}
      onClose={closeModal}
      title={t("MSG_0185") + (popType === crudType.CREATE ? "등록" : "수정")}
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
                value={objState.mSelectedRow?.waybill_no}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="invoice_no"
                  value={mSelectedRow?.invoice_no}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="invoice_dd"
                  value={mSelectedRow?.invoice_dd}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>

              <MaskedInputField
                id="portent"
                value={mSelectedRow?.portent}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="shippername"
                value={mSelectedRow?.shippername}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="soldto"
                value={mSelectedRow?.soldto}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="grosswt"
                  value={mSelectedRow?.grosswt}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="grossunit"
                  value={mSelectedRow?.grossunit}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="netwt"
                  value={mSelectedRow?.netwt}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="netunit"
                  value={objState.mSelectedRow?.netunit}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="measurement"
                  value={mSelectedRow?.measurement}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
                <MaskedInputField
                  id="measureunit"
                  value={mSelectedRow?.measureunit}
                  options={{
                    isReadOnly: popType === crudType.CREATE ? false : true,
                  }}
                />
              </div>
            </div>
            <div className="col-span-2 p-4 ">
              <MaskedInputField
                id="declnum"
                value={mSelectedRow?.declnum}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="mwb_no"
                value={mSelectedRow?.mwb_no}
                options={{
                  isReadOnly: false,
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="exrate"
                  value={mSelectedRow?.exrate}
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
                    defaultValue={mSelectedRow?.incoterms}
                    isDisplay={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="decldate"
                  value={mSelectedRow?.decldate}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                <MaskedInputField
                  id="decltime"
                  value={mSelectedRow?.decltime}
                  options={{
                    isReadOnly: false,
                    type: "time",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="ccdate"
                  value={mSelectedRow?.ccdate}
                  options={{
                    inline: false,
                    textAlign: "center",
                    freeStyles: "p-1 border-1 border-slate-300",
                  }}
                />
                <MaskedInputField
                  id="cctime"
                  value={mSelectedRow?.cctime}
                  options={{
                    isReadOnly: false,
                    type: "time",
                  }}
                />
              </div>
              <MaskedInputField
                id="totaldeclvalue"
                value={mSelectedRow?.totaldeclvalue}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="totaldeclfltvalue"
                value={mSelectedRow?.totaldeclfltvalue}
                options={{
                  isReadOnly: false,
                }}
              />
              <MaskedInputField
                id="totaldeclinsvalue"
                value={mSelectedRow?.totaldeclinsvalue}
                options={{
                  isReadOnly: false,
                }}
              />
            </div>
            <div className="col-span-2 p-4 ">
              <MaskedInputField
                id="receivedatetime"
                value={mSelectedRow?.receivedatetime}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="updatetime"
                value={mSelectedRow?.updatetime}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="senddatetime"
                value={mSelectedRow?.senddatetime}
                options={{
                  isReadOnly: popType === crudType.CREATE ? false : true,
                }}
              />
            </div>
            <div className="col-span-2 p-6 ">
              <Badge
                size={"md"}
                name={mSelectedRow?.waybill_no}
                color="border-sky-500 text-sky-500"
                rounded
                outlined
              />
            </div>
          </div>
          <div className="h-full col-span-3">
            <DetailGrid
              params={{
                waybill_no: objState.mSelectedRow?.waybill_no,
                invoice_no: objState.mSelectedRow?.invoice_no,
              }}
            />
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
