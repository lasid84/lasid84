import DialogBasic from "layouts/dialog/dialog";
import {
  Controller,
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import {
  crudType,
  SEARCH_M,
  useAppContext,
} from "components/provider/contextObjectProvider";
import {  SP_UpdateData } from "../data";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import CustomSelect from "components/select/customSelect";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import DetailGrid from "./popupGrid";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
  const { dispatch, objState } = useAppContext();  
  const { popUp, mSelectedRow, searchParams  } = objState;
  const { crudType: popType, isPopUpOpen : isOpen}  = popUp

  const { t } = useTranslation();
  //const { Create } = useUpdateData2(SP_InsertCustData);
  const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    dispatch({
      isPopUpOpen: false,
      popUp : {...popUp, isPopUpOpen: false },
      mSelectedRow: { ...mSelectedRow, ...getValues() },
    });
  };

  //Set select box data

  useEffect(() => {
    if (loadItem) {
         
    }
  }, [loadItem]);

  useEffect(() => {
    // log("=====", loadItem);
    if (loadItem && mSelectedRow && Object.keys(mSelectedRow).length > 0) {
    }
  }, [mSelectedRow, loadItem]);

  useEffect(() => {
    reset();
    if (popType === crudType.CREATE) {
      setFocus("use_yn");
    }
  }, [popType, isOpen]);

  const onSave = useCallback(async () => {
    var param = getValues();
    // try {
    if (popType === crudType.UPDATE) {
      const jsonData = JSON.stringify([param]);
      // log("onSave1", jsonData)
      await Update.mutateAsync(
        { jsondata: jsonData },
        {
          onSuccess: (res: any) => {
            closeModal();
          },
        }
      ).catch((err) => {});
    } else {
      // log("onSave2", param)
      // await Create.mutateAsync(param, {
      //   onSuccess(data, variables, context) {
      //     closeModal();
      //   },
      //   onError(error, variables, context) {},
      // }).catch((err) => {});
    }

  }, [popType]);

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
                value={mSelectedRow?.waybill_no}
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
                  value={mSelectedRow?.netunit}
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
                <MaskedInputField
                  id="incoterms"
                  value={mSelectedRow?.incoterms}
                  options={{
                    isReadOnly: false,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="decldate"
                  value={mSelectedRow?.decldate}
                  options={{
                    isReadOnly: false,
                  }}
                />
                <MaskedInputField
                  id="decltime"
                  value={mSelectedRow?.decltime}
                  options={{
                    isReadOnly: false,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="ccdate"
                  value={mSelectedRow?.ccdate}
                  options={{
                    isReadOnly: false,
                  }}
                />
                <MaskedInputField
                  id="cctime"
                  value={mSelectedRow?.cctime}
                  options={{
                    isReadOnly: false,
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
