
import { MaskedInputField, TextArea } from "components/input";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { ReactSelect, data } from "components/select/react-select2";
import { Button } from 'components/button';
import CustomSelect from "@/components/select/customSelect";
import { useCommonStore } from "../_store/store";

import { log, error } from '@repo/kwe-lib-new';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

type Props = {
};

const BasicInfo = forwardRef((props:Props, focusRef) => {

    const { getValues } = useFormContext();
    const loadDatas = useCommonStore((state) => state.loadDatas);
    const selectedCustData = useCommonStore((state) => state.selectedCustData);
    const custDetailData = useCommonStore((state) => state.custDetailData);
    const componetHeight = "h-5"

    const { setState } = useCommonStore((state) => state.actions);

    // const onChangedData = useCallback(() => {
    //     const params = getValues();
    //     setState({selectedCustData: {...params}});
    // }, []);

    return (
        <form>
            <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-10">
                <div className="col-span-2">
                    <MaskedInputField
                        id="cust_code"
                        value={selectedCustData?.cust_code}
                        height={componetHeight}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="cust_nm_eng"
                        height={componetHeight}
                        value={selectedCustData?.cust_nm_eng}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="사업장??"
                        height={componetHeight}
                        // value={selectedCustData?.cust_code}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="bz_reg_no"
                        height={componetHeight}
                        value={selectedCustData?.bz_reg_no}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                {/* <div className="col-span-1">
                    <Button id={"btnHideBasicInfo"} height="h-5" color="white"
                        icon={<MdVisibilityOff size={'12'} />}
                    />
                </div> */}
                <div className="col-span-3">
                    <MaskedInputField
                        id="addr1_eng"
                        height={componetHeight}
                        value={selectedCustData?.addr1_eng}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="cust_nm"
                        height={componetHeight}
                        value={selectedCustData?.cust_nm}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="executive_nm"
                        height={componetHeight}
                        value={selectedCustData?.executive_nm}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="billto_cd"
                        height={componetHeight}
                        // value={selectedCustData?.cust_code}
                        value={custDetailData?.billto_cd}
                        options={{
                            isReadOnly: false,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="addr2_eng"
                        height={componetHeight}
                        value={selectedCustData?.addr2_eng}
                        options={{
                            isReadOnly: true,
                            inline:true,
                            noLabel: true,
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="addr1"
                        height={componetHeight}
                        // value={selectedCustData?.cust_code}
                        value={selectedCustData?.addr1}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="bz_con"
                        height={componetHeight}
                        value={selectedCustData?.bz_con}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="create_user"
                        height={componetHeight}
                        value={custDetailData?.create_user}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="addr3_eng"
                        height={componetHeight}
                        value={selectedCustData?.addr3_eng}
                        options={{
                            isReadOnly: true,
                            inline:true,
                            noLabel: true,
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-3">
                    <MaskedInputField
                        id="addr2"
                        height={componetHeight}
                        value={selectedCustData?.addr2}
                        options={{
                            isReadOnly: true,
                            inline:true,
                            noLabel:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="bz_item"
                        height={componetHeight}
                        value={selectedCustData?.bz_item}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="update_user"
                        height={componetHeight}
                        value={custDetailData?.update_user}
                        options={{
                            isReadOnly: true,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>
            </div>
        </form>
    );
});

export default memo(BasicInfo);