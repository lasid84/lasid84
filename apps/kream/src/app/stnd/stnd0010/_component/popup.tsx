import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_CreateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, crudType: popType, isPopUpOpen: isOpen, searchParams } = objState;
    const router = usePathname()
    const { Update } = useUpdateData2(SP_UpdateData);
    const { Create } = useUpdateData2(SP_CreateData);

    // 선택된 데이터 Select컴포넌트 처리
    const [transmode, setTransmode] = useState([]);
    const [transtype, setTranstype] = useState([]);
    const [prodGrCd, setprodGrCd] = useState([]);
    const [billGr1Cd, setBillGr1Cd] = useState([]);
    const [glGr1Cd, setGlGr1Cd] = useState([]);
    const [glGr2Cd, setGlGr2Cd] = useState([]);

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }
    const defTransMode = popType === crudType.CREATE ? searchParams.trans_mode : mSelectedRow?.trans_mode;
    const defTransType = popType === crudType.CREATE ? searchParams.trans_type : mSelectedRow?.trans_type;
    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
            trans_mode: defTransMode,
            trans_type: defTransType,
            use_yn: "Y",
        },
    });

    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        resetField,
        getValues,
        formState: { errors },
        control,
    } = formZodMethods;

    useEffect(() => {
        if (loadItem) {
            setTransmode(loadItem[0])
            setTranstype(loadItem[1])
            setprodGrCd(loadItem[2])
            setGlGr1Cd(loadItem[5])
            setGlGr2Cd(loadItem[6])
        }
    }, [loadItem]);

    useEffect(() => {
        // log("=====", loadItem);
        if (loadItem && mSelectedRow && Object.keys(mSelectedRow).length > 0) {
            var modetype = mSelectedRow?.trans_mode + mSelectedRow?.trans_type;
            switch (modetype) {
                case "AE": setBillGr1Cd(loadItem[7]); break;
                case "AI": setBillGr1Cd(loadItem[8]); break;
                case "OE": setBillGr1Cd(loadItem[9]); break;
                case "OI": setBillGr1Cd(loadItem[10]); break;
            }
        }
    }, [mSelectedRow, loadItem])

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        log("onFormSubmit", param)
        if (popType === crudType.UPDATE) {
            Update.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            });
        } else {
            Create.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
                // onError:(res:any) =>{
                //     toastError("등록에실패했습니다."+res);
                // }
            })
        }

    }, [popType]);

    useEffect(() => {
        reset()
        log("popup mSelectedRow :", mSelectedRow);
        if (popType === crudType.CREATE) {
            setFocus("trans_mode")
        }
        // if (popType === PopType.UPDATE) {
        //     setModalValue(selectedData, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     setGrpCd(selectedData.grp_cd)
        //     setUseYn(selectedData.use_yn)

        //     //setUseGrpCd(selectedData.grp_cd)
        // }
    }, [popType, isOpen])

    return (

        <FormProvider{...formZodMethods}>
            <DialogBasic
                isOpen={isOpen!}
                onClose={closeModal}
                title={"Port코드 관리 - " + (popType === crudType.CREATE ? "등록" : "수정")}
                bottomRight={
                    <>
                        <Button id={"save"} onClick={handleSubmit(onFormSubmit)} icon={null} />
                        <Button id={"cancel"} onClick={closeModal} icon={null} />
                    </>
                }
            >
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-6">
                        

                        <div className="col-span-2">

                            <MaskedInputField
                                id="port_code"
                                value={mSelectedRow?.port_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <MaskedInputField
                                id="port_name"
                                value={mSelectedRow?.port_name}
                                options={{                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="country_code"
                                value={mSelectedRow?.country_code}
                                options={{                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="time_zone_code"
                                value={mSelectedRow?.time_zone_code}
                                options={{                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="region_code"
                                value={mSelectedRow?.region_code}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="mdate_tz_code"
                                value={mSelectedRow?.mdate_tz_code}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="cdate_tz_code"
                                value={mSelectedRow?.cdate_tz_code}
                                options={{
                                }}
                            />
                        </div>
                         <div className="col-span-2">
                            <MaskedInputField
                                id="port_nm"
                                value={mSelectedRow?.port_nm}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="use_yn"
                                value={mSelectedRow?.use_yn}
                                options={{
                                }}
                            />
                        </div>

                        {/*
                        <div className="col-span-2">
                            <MaskedInputField
                                id="airport_ind"
                                value={mSelectedRow?.airport_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="sea_port_ind"
                                value={mSelectedRow?.sea_port_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="other_port_ind"
                                value={mSelectedRow?.other_port_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="hmf_pct"
                                value={mSelectedRow?.hmf_pct}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="city_ind"
                                value={mSelectedRow?.city_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="congested_ind"
                                value={mSelectedRow?.congested_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="mlb_ipi_ind"
                                value={mSelectedRow?.mlb_ipi_ind}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="port_auth_fees_ind"
                                value={mSelectedRow?.port_auth_fees_ind}
                                options={{
                                }}
                            />
                        </div>    

                        <div className="col-span-2">
                            <MaskedInputField
                                id="port_auth_fees_ind"
                                value={mSelectedRow?.port_auth_fees_ind}
                                options={{
                                }}
                            />
                        </div>    

                        <div className="col-span-2">
                            <MaskedInputField
                                id="port_auth_fees_ind"
                                value={mSelectedRow?.port_auth_fees_ind}
                                options={{
                                }}
                            />
                        </div>    
                         */}
                    </div>
                </form>
            </DialogBasic>
        </FormProvider>

    )

}

export default Modal;