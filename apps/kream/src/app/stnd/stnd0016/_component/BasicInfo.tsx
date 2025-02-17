
import { MaskedInputField, TextArea } from "components/input";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { ReactSelect, data } from "components/select/react-select2";
import { Button } from "@mui/material";
import CustomSelect from "@/components/select/customSelect";
import { useCommonStore } from "../_store/store";

import { log, error } from '@repo/kwe-lib-new';

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







            {/* <div className="col-span-3">
                 <CustomSelect
                    id="cust_code"
                    ref={focusRef}                
                    initText="Select an option"
                    listItem={loadDatas?.[0]}
                    valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
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
                    inline={false}
                    defaultValue={selectedCustData?.cust_code}
                    events={{
                    }}
                    />
            </div>
            <ReactSelect
                id="transport_type" dataSrc={loadDatas?.[3]}
                options={{
                    keyCol: "transport_type",
                    displayCol: ['transport_type_nm'],
                    defaultValue: selectedCustData?.transport_type,
                    isAllYn: false
                }}/>
            
           
            <div className="col-span-2">
                <TextArea id={"manager"} rows={5} cols={0}
                    value={selectedCustData?.manager}
                />
            </div> */}
            {/* <div className="col-span-2 md:grid md:grid-rows-3">
                <div className="col-span-2">
                    <MaskedInputField
                        id="tel_no"
                        value={selectedCustData?.tel_no}
                        options={{
                            isReadOnly: false,
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="cell_no"
                        value={selectedCustData?.cell_no}
                        options={{
                            isReadOnly: false,
                            
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="delivery_request_tm"
                        value={selectedCustData?.delivery_request_tm}
                        options={{
                            isReadOnly: false,
                            
                        }}
                    />
                </div>
            </div>
            
            <div className="col-span-4">
                <TextArea id={"delivery_request_remark"} rows={4} cols={0}
                    value={selectedCustData?.delivery_request_remark}
                />
            </div>
            <div className="col-span-4">
                <TextArea id={"remark"} rows={4} cols={0}
                    value={selectedCustData?.remark}
                />
            </div>
            <div className="col-span-2">
                <ReactSelect
                    id="use_yn" dataSrc={{
                        data: [
                            { use_yn: 'Y' },
                            { use_yn: 'N' }
                        ]
                    } as data}
                    options={{
                        dialog: true,
                        keyCol: "use_yn",
                        displayCol: ['use_yn'],
                        defaultValue: selectedCustData?.use_yn
                    }}
                />
            </div> */}
        </div>
        </form>
    );
});

export default memo(BasicInfo);