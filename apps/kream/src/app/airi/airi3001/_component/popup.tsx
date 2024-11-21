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
import { CUST_TYPE_TRANSPORT, SP_InsertCustData, SP_UpdateData } from "./data";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import CustomSelect from "components/select/customSelect";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { Checkbox } from "@/components/checkbox";
import DetailGrid from "./popupDetailGrid";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Callback = () => void;
type Props = {
  loadItem: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = ({ loadItem, callbacks }) => {
  const { dispatch, objState } = useAppContext();
  const { mSelectedRow, popType, isPopUpOpen: isOpen, searchParams } = objState;
  const router = usePathname();
  const { Create } = useUpdateData2(SP_InsertCustData);
  const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    dispatch({
      isPopUpOpen: false,
      mSelectedRow: { ...mSelectedRow, ...getValues() },
    });

    // if (callbacks?.length) await callbacks.forEach((callback: Callback) => callback())

    // reset();
  };

  //Set select box data
  const [maincustcode, setMaincustcode] = useState<any>();
  const [bztype, setBztype] = useState<any>();
  const [bzkindcd, setBzkindcd] = useState<any>();
  const [nationcode, setNationcode] = useState<any>();
  const [areacd, setAreacd] = useState<any>();

  useEffect(() => {
    if (loadItem) {
      setNationcode(loadItem[0]);
      setAreacd(loadItem[1]);
      setMaincustcode(loadItem[2]);
      setBzkindcd(loadItem[3]);
      setBztype(loadItem[4]);
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
      await Create.mutateAsync(param, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error, variables, context) {},
      }).catch((err) => {});
    }
    // dispatch({ isMSearch: true });
    // } catch(err) {
    //     log("catch err", err)
    // }
  }, [popType]);

  return (
    <DialogBasic
      isOpen={isOpen!}
      onClose={closeModal}
      title={"거래처 관리 - " + (popType === crudType.CREATE ? "등록" : "수정")}
      bottomRight={
        <>
          <Button id={"save"} onClick={onSave} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="flex-col gap-4 md:grid md:grid-col-5">
          <div className="col-span-1">
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
          </div>
          <div className="col-span-1">
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
          </div>
          <div className="col-span-1">
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
          </div>
          <div className="col-span-1">
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="bz_con"
              value={mSelectedRow?.bz_con}
              options={{
                isReadOnly: popType === crudType.CREATE ? false : true,
              }}
            />
          </div>

          <div className="col-span-5">
            <DetailGrid
              params={{
                carrier_code: objState.mSelectedRow?.carrier_code,
                cont_type: "sale",
              }}
            />
          </div>

          {/* <div className="col-span-1">
                        <MaskedInputField
                            id="cust_code"
                            value={mSelectedRow?.cust_code}
                            options={{
                                isReadOnly: mSelectedRow?.cust_code === CUST_TYPE_TRANSPORT ? true : (popType === crudType.CREATE ? false : true),
                            }}
                        />
                    </div>

                    <div className="col-span-2">
                        <MaskedInputField
                            id="city_nm"
                            value={mSelectedRow?.city_nm}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>

                    <ReactSelect
                        id="bz_type" dataSrc={bztype as data}
                        options={{
                            keyCol: "bz_type",
                            displayCol: ['bz_type', 'name'],
                            defaultValue: mSelectedRow?.bz_type,
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }}
                    />

                    <MaskedInputField
                        id="bz_con"
                        value={mSelectedRow?.bz_con}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />

                    <div className="col-span-2">
                        <MaskedInputField
                            id="cust_nm"
                            value={mSelectedRow?.cust_nm}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>


                    <div className="col-span-2">
                        <MaskedInputField
                            id="addr1"
                            value={mSelectedRow?.addr1}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>



                    <MaskedInputField
                        id="bz_reg_no"
                        value={mSelectedRow?.bz_reg_no}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                            type: "bz_reg_no",
                        }} />

                    <MaskedInputField
                        id="bz_item"
                        value={mSelectedRow?.bz_item}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />



                    <div className="col-span-2">
                        <MaskedInputField
                            id="cust_nm_abbr"
                            value={mSelectedRow?.cust_nm_abbr}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>

                    <div className="col-span-2">
                        <MaskedInputField
                            id="addr2"
                            value={mSelectedRow?.addr2}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>
                    <MaskedInputField
                        id="corp_reg_no"
                        value={mSelectedRow?.corp_reg_no}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />

                    <ReactSelect
                        id="bz_kind_cd" dataSrc={bzkindcd as data}
                        options={{
                            keyCol: "bz_kind_cd",
                            displayCol: ['bz_kind_cd', 'name'],
                            defaultValue: mSelectedRow?.bz_kind_cd,
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }}
                    />

                    <div className="col-span-2">
                        <MaskedInputField
                            id="cust_nm_eng"
                            value={mSelectedRow?.cust_nm_eng}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>



                    <div className="col-span-2">
                        <MaskedInputField
                            id="city_nm_eng"
                            value={mSelectedRow?.city_nm_eng}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>
                    <MaskedInputField
                        id="vendor_id"
                        value={mSelectedRow?.vendor_id}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />


                    <MaskedInputField
                        id="contact_nm"
                        value={mSelectedRow?.contact_nm}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />


                    <MaskedInputField id="executive_nm" value={mSelectedRow?.executive_nm} 
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    <Checkbox id="use_yn" value={mSelectedRow?.use_yn} />

                    <div className="col-span-2">
                        <MaskedInputField
                            id="addr1_eng"
                            value={mSelectedRow?.addr1_eng}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>
                    <ReactSelect
                        id="nation_code" dataSrc={nationcode as data}
                        options={{
                            dialog: true,
                            keyCol: "country_cd",
                            displayCol: ['country_cd'],
                            defaultValue: mSelectedRow?.nation_code,
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />

                    <MaskedInputField
                        id="tel_no"
                        value={mSelectedRow?.tel_no}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />


                    <Checkbox id="sale_cust_yn" value={mSelectedRow?.sale_cust_yn} />


                    <Checkbox id="prch_cust_yn" value={mSelectedRow?.prch_cust_yn} />

                    <div className="col-span-2">
                        <MaskedInputField
                            id="addr2_eng"
                            value={mSelectedRow?.addr2_eng}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                    </div>

                    <ReactSelect
                        id="area_cd" dataSrc={areacd as data}
                        options={{
                            dialog: true,
                            keyCol: "area_cd",
                            displayCol: ['area_cd', 'name'],
                            defaultValue: mSelectedRow?.area_cd,
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }}
                    />

                    <MaskedInputField
                        id="fax_no"
                        value={mSelectedRow?.fax_no}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} />


                    <Checkbox id="gen_cust_yn" value={mSelectedRow?.gen_cust_yn} />
                    <Checkbox id="cal_except_yn" value={mSelectedRow?.cal_except_yn} />
                    <Checkbox id="crrg_cust_yn" value={mSelectedRow?.crrg_cust_yn} />
                    <MaskedInputField
                        id="post_no"
                        value={mSelectedRow?.post_no}
                        options={{
                            isReadOnly: popType === crudType.CREATE ? false : true,
                        }} /> */}
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
