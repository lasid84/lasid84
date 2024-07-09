import { ROW_INDEX } from "@/components/grid/ag-grid-enterprise";
import { GroupBox } from "@/components/groupBox";
import { MaskedInputField, TextArea } from "components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const { log } = require('@repo/kwe-lib/components/logHelper');

const CustomerDetail: React.FC = () => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, gridRef_m } = objState;

    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
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

    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        log("onFormSubmit", param)
    }, []);

    const handleMaskedInputChange = (e:any) => {
        // log("=========handleMaskedInputChange", e)
        e.preventDefault();
        const id = e.target.id;
        const val = getValues(id);
        if (gridRef_m) {
            const rowNode = gridRef_m.current.api.getRowNode((mSelectedRow[ROW_INDEX] -1).toString());
            log("=========handleMaskedInputChange", rowNode, id, val)
            rowNode.setDataValue(id, val);
            dispatch({ mSelectedRow: {...rowNode.data}})
        }
    }

    const handleTextAreaChange = (e:any) => {
        // log("=========handleMaskedInputChange", e)
        e.preventDefault();
        const id = e.target.id;
        const val = getValues(id);
        if (gridRef_m) {
            const rowNode = gridRef_m.current.api.getRowNode((mSelectedRow[ROW_INDEX] -1).toString());
            log("=========handleTextAreaChange", rowNode, id, val)
            rowNode.setDataValue(id, val);
            dispatch({ mSelectedRow: {...rowNode.data}})
        }
    }

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-4">
                    <MaskedInputField 
                        id="cust_code" 
                        value={mSelectedRow?.cust_code}
                        options = {{ 
                            isReadOnly:true,
                            freeStyles:"border-1 border-slate-300"
                        }}
                        />
                    <MaskedInputField 
                        id="executive_nm" 
                        value={mSelectedRow?.executive_nm}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="bz_reg_no" 
                        value={objState.mSelectedRow?.bz_reg_no}
                        options = {{ 
                            type:"bz_reg_no",
                            isReadOnly:true
                        }}
                        />
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="cust_nm" 
                            value={objState.mSelectedRow?.cust_nm}
                            options = {{ 
                                isReadOnly:true
                            }}
                            />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="cust_nm_eng" 
                            value={objState.mSelectedRow?.cust_nm_eng}
                            options = {{ 
                                isReadOnly:true
                            }}
                            />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="addr1" 
                            value={objState.mSelectedRow?.addr1}
                            options = {{ 
                                isReadOnly:true
                            }}
                        />
                    </div>
                    <div className="col-span-2">

                    </div>

                    <div className="row-span-2">
                        <TextArea id="cont_add_info" rows={6} cols={0}  
                            value={objState.mSelectedRow?.cont_add_info}
                            options={{ 
                                isReadOnly: false, 
                                inline:false, 
                                freeStyles:"resize-none"
                            }} 
                            events={{
                                onChange:handleTextAreaChange
                            }}
                            />

                        <GroupBox title="customs_agent_info">
                            <MaskedInputField 
                                id="customs_agent" 
                                value={"kwe/ 넥스트 "}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />

                            <MaskedInputField 
                                id="customs_agent_pic" 
                                value={objState.mSelectedRow?.addr1}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />
                            <MaskedInputField 
                                id="customs_agent_tel" 
                                value={objState.mSelectedRow?.addr1}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />
                        </GroupBox>
                    </div>

                    <div className="row-span-2">
                        <GroupBox title="pickup_info">
                            <MaskedInputField 
                                id="pickup_gubn" 
                                value={objState.mSelectedRow?.addr1}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />
                            <MaskedInputField 
                                id="pickup_pic" 
                                value={objState.mSelectedRow?.addr1}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />
                            <MaskedInputField 
                                id="pickup_tel" 
                                value={objState.mSelectedRow?.addr1}
                                lwidth="w-12"
                                options = {{ 
                                    isReadOnly:false,
                                    inline:true
                                }}
                                events={{
                                    onChange:handleMaskedInputChange
                                }}
                            />
                            <TextArea id="pickup_place" rows={6} cols={0}  
                                value="통관운송 KWE

입고 : 부산시 기장군 기장읍 대변로 32 ㈜인퓨전프로젝
입고받을 담당자 : 송지미 사원 (M. 010-4240-3708)"
                                options={{ 
                                    isReadOnly: false, 
                                    inline:false, 
                                    freeStyles:"resize-none"
                                }} 
                                events={{
                                    onChange:handleTextAreaChange
                                }}
                                />
                        </GroupBox>
                    </div>
                    
                    <div className="col-span-2">
                        <TextArea id="remark" rows={5} cols={0}  
                            value="적하보험부보 
징수형태 11, 거래구분 11

6403.91-9000 신발 13%
6402.99-9000 고무제슬리퍼 13%"
                            options={{ 
                                isReadOnly: false, 
                                inline:false, 
                                freeStyles:"resize-none"
                            }} 
                            events={{
                                onChange:handleTextAreaChange
                            }}
                            />

                        <TextArea id="freigh_info" rows={5} cols={1}  
                            value="CREDIT,  관부가세까지 후불

송부: ifp@ifpkorea.com"
                            options={{ 
                                isReadOnly: false, 
                                inline:false, 
                                freeStyles:"resize-none"
                            }} 
                            events={{
                                onChange:handleTextAreaChange
                            }}
                            />
                    </div>
         
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;