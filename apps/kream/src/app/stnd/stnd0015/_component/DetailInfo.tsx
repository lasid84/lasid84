import { ROW_INDEX } from "components/grid/ag-grid-enterprise";
import { MaskedInputField, TextArea } from "components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { ReactSelect, data } from "components/select/react-select2";
import { Button } from "@mui/material";
import CustomSelect from "@/components/select/customSelect";
import { useCommonStore } from "../_store/store";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
};

const CustomerDetail = forwardRef((props:Props, focusRef) => {

    const { getValues } = useFormContext();
    const loadDatas = useCommonStore((state) => state.loadDatas);
    const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);

    const { setState } = useCommonStore((state) => state.actions);

    // const onChangedData = useCallback(() => {
    //     const params = getValues();
    //     setState({mainSelectedRow: {...params}});
    // }, []);

    return (
        <form>
        <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-4">
            <div className="col-span-3">
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
                    defaultValue={mainSelectedRow?.cust_code}
                    events={{
                    }}
                    />
            </div>
            <ReactSelect
                id="transport_type" dataSrc={loadDatas?.[3]}
                options={{
                    keyCol: "transport_type",
                    displayCol: ['transport_type_nm'],
                    defaultValue: mainSelectedRow?.transport_type,
                    isAllYn: false
                }}/>
            <div className="col-span-2">
                <MaskedInputField
                    id="loc_nm"
                    value={mainSelectedRow?.loc_nm}
                    options={{
                        isReadOnly: false,
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
            </div>
            <div className="col-span-2">
                <MaskedInputField
                    id="loc_nm_short"
                    value={mainSelectedRow?.loc_nm_short}
                    options={{
                        isReadOnly: false,
                    }}
                />
            </div>
            <div className="col-span-2">
                <ReactSelect
                    id="province_cd" dataSrc={loadDatas?.[1]}
                    options={{
                        keyCol: "province_cd",
                        displayCol: ['province_nm'],
                        defaultValue: mainSelectedRow?.province_cd,
                        isAllYn: false
                    }}
                />  
            </div>
            <div className="col-span-2">
                <MaskedInputField
                    id="area_cd"
                    value={mainSelectedRow?.area_cd}
                    options={{
                        isReadOnly: false,
                    }}
                />
            </div>
            <div className="col-span-3">
                <MaskedInputField
                    id="addr"
                    value={mainSelectedRow?.addr}
                    options={{
                        isReadOnly: false,
                    }}
                />
            </div>
                <ReactSelect
                    id="loc_type" dataSrc={loadDatas?.[2]}
                    options={{
                        keyCol: "loc_type",
                        displayCol: ['loc_type_nm'],
                        defaultValue: mainSelectedRow?.loc_type,
                        isAllYn: false
                    }}
                />  
            <div className="col-span-2">
                <TextArea id={"manager"} rows={5} cols={0}
                    value={mainSelectedRow?.manager}
                />
            </div>
            <div className="col-span-2 md:grid md:grid-rows-3">
                <div className="col-span-2">
                    <MaskedInputField
                        id="tel_no"
                        value={mainSelectedRow?.tel_no}
                        options={{
                            isReadOnly: false,
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="cell_no"
                        value={mainSelectedRow?.cell_no}
                        options={{
                            isReadOnly: false,
                            
                        }}
                    />
                </div>
                <div className="col-span-2">
                    <MaskedInputField
                        id="delivery_request_tm"
                        value={mainSelectedRow?.delivery_request_tm}
                        options={{
                            isReadOnly: false,
                            
                        }}
                    />
                </div>
            </div>
            
            <div className="col-span-4">
                <TextArea id={"delivery_request_remark"} rows={4} cols={0}
                    value={mainSelectedRow?.delivery_request_remark}
                />
            </div>
            <div className="col-span-4">
                <TextArea id={"remark"} rows={4} cols={0}
                    value={mainSelectedRow?.remark}
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
                        defaultValue: mainSelectedRow?.use_yn
                    }}
                />
            </div>
        </div>
        </form>
    );
});

export default memo(CustomerDetail);