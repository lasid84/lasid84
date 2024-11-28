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
import { SP_UpdateData } from "../data";
import { FileUpload } from "components/file-upload";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import CustomSelect from "components/select/customSelect";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "components/button";
import {
  gridData,
  JsonToGridData,
  ROW_TYPE,
  ROW_TYPE_NEW,
} from "@/components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import DetailGrid from "../Detail/popupGrid";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
  const { dispatch, objState } = useAppContext();
  const { popUp, mSelectedRow, searchParams  } = objState;
  const { crudType: popType, isPopUpUploadOpen : isOpen} = popUp

  const { t } = useTranslation();
  //const { Create } = useUpdateData2(SP_InsertCustData);
  const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    dispatch({
      //isPopUpOpen: false,
      popUp : {...popUp, isPopUpUploadOpen: false },
      //mSelectedRow: { ...mSelectedRow, ...getValues() },
    });

    // if (callbacks?.length) await callbacks.forEach((callback: Callback) => callback())

    // reset();
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

      // await Create.mutateAsync(param, {
      //   onSuccess(data, variables, context) {
      //     closeModal();
      //   },
      //   onError(error, variables, context) {},
      // }).catch((err) => {});
    }
    // dispatch({ isMSearch: true });
    // } catch(err) {
    //     log("catch err", err)
    // }
  }, [popType]);

  const handleFileDrop = (data: any[], header: any[]) => {
    data = data.map((obj) => {
      return {
        [ROW_TYPE]: ROW_TYPE_NEW,
        ...obj,
      };
    });
    var gridData = JsonToGridData(data, header, 2);
    dispatch({ excel_data: gridData });
    // Create.mutate({excel_data:data}, {
    //     onSuccess: (res: any) => {
    //         dispatch({ isMSearch: true });
    //     }
    // });
  };

  return (
    <DialogBasic
      isOpen={isOpen!}
      onClose={closeModal}
      title={t("MSG_0186") + (popType === crudType.CREATE ? "등록" : "수정")}
      bottomRight={
        <>
          <Button id={"save"} onClick={onSave} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-[70vw] h-[70vh] p-1 border rounded-lg  mx-auto">
            <div className="w-full p-4">
              <FileUpload
                onFileDrop={handleFileDrop}
                isInit={objState.uploadFile_init}
              />
                <DetailGrid
                  params={{
                    waybill_no: objState.mSelectedRow?.waybill_no,
                    invoice_no: objState.mSelectedRow?.invoice_no,
                  }}
                />
            </div>
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
