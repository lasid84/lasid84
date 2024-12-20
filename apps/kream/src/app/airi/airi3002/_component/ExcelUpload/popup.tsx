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
// import { SP_UpdateData } from "../../_store/data";
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
import { useCommonStore } from "../../_store/store";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem?: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = () => {
  
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const { crudType: popType, isPopUpUploadOpen = false} = state.popup;

  const { t } = useTranslation();
  //const { Create } = useUpdateData2(SP_InsertCustData);
  // const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    actions.setState({popup:{...state.popup, isPopUpUploadOpen:false}});
  };

  // useEffect(() => {
  //   reset();
  //   if (popType === crudType.CREATE) {
  //     setFocus("use_yn");
  //   }
  // }, [popType, isOpen]);

  const onSave = useCallback(async () => {
    var param = getValues();
    // // try {
    // if (popType === crudType.UPDATE) {
    //   const jsonData = JSON.stringify([param]);
    //   // log("onSave1", jsonData)
    //   await Update.mutateAsync(
    //     { jsondata: jsonData },
    //     {
    //       onSuccess: (res: any) => {
    //         closeModal();
    //       },
    //     }
    //   ).catch((err) => {});
    // } else {

    //   // await Create.mutateAsync(param, {
    //   //   onSuccess(data, variables, context) {
    //   //     closeModal();
    //   //   },
    //   //   onError(error, variables, context) {},
    //   // }).catch((err) => {});
    // }
    // // dispatch({ isMSearch: true });
    // // } catch(err) {
    // //     log("catch err", err)
    // // }
  }, [popType]);

  const handleFileDrop = (data: any[], header: any[]) => {
    const filter = (state.loadDatas ?? [])[0].data as [];
    if (filter?.length) {
      const groupedFilter = filter.reduce<Record<string, any[]>>((acc, { key, value }) => {
        acc[key] = acc[key] || [];
        acc[key].push(value);
        return acc;
      }, {});
      
      data = data.filter((row) => {
        return Object.entries(groupedFilter).every(([key, values]) => {
          if (values.length > 1) {
            // 같은 키에 여러 값이 있으면 OR 조건
            return values.includes(row[key]);
          } else {
            // 같은 키에 하나의 값만 있으면 = 조건
            return row[key] === values[0];
          }
        });
      });
    }
    
    // data = data.map((obj) => {
    //   return {
    //     [ROW_TYPE]: ROW_TYPE_NEW,
    //     ...obj,
    //   };
    // });
    // var gridData = JsonToGridData(data, header, 2);
    // dispatch({ excel_data: gridData });
    // // Create.mutate({excel_data:data}, {
    // //     onSuccess: (res: any) => {
    // //         dispatch({ isMSearch: true });
    // //     }
    // // });

    actions.insAirTracker({jsonData: JSON.stringify(data)});
  };

  return (
    <DialogBasic
      isOpen={isPopUpUploadOpen}
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
                headerRow={4}
                // isInit={objState.uploadFile_init}
              />
                {/* <DetailGrid
                  params={{
                    waybill_no: objState.mSelectedRow?.waybill_no,
                    invoice_no: objState.mSelectedRow?.invoice_no,
                  }}
                /> */}
            </div>
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
