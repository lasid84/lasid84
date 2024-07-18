import { ROW_INDEX } from "components/grid/ag-grid-enterprise";
import { MaskedInputField } from "components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ReactSelect, data } from "components/select/react-select2";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const CustomerDetail: React.FC<Props> = ({initData}) => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, gridRef_m } = objState;
    const [ area, setArea] = useState([]);

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

    }, [objState.popType]);

    useEffect(() => {
        if (initData) {
            setArea(initData[0])
        }
    }, [initData]);

    const handleMaskedInputChange = (e:any) => {
        log("=========handleMaskedInputChange", e)
        const id = e.target.id;
        const val = getValues(id);
        if (gridRef_m) {
            const rowNode = gridRef_m.current.api.getRowNode((mSelectedRow[ROW_INDEX] -1).toString());
            rowNode.setDataValue(id, val);
            dispatch({ mSelectedRow: {...rowNode.data}})
        }
    }

    const handleReactSelectChange = (e:any) => {
        if (gridRef_m) {
            for (const [id,val] of Object.entries(e)) {
                const rowNode = gridRef_m.current.api.getRowNode((mSelectedRow[ROW_INDEX] -1).toString());
                rowNode.setDataValue(id, val);
                dispatch({ mSelectedRow: {...rowNode.data}})
            }
        }
    }

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-6 ">
                    <div className="col-span-2">
                        <MaskedInputField
                            id="place_code"
                            value={mSelectedRow?.place_code}
                            options={{
                                isReadOnly: true,
                                freeStyles: "border-1 border-slate-300"
                            }}
                        />
                    </div>
                    <div className="col-span-4">
                        <MaskedInputField
                            id="place_nm"
                            value={mSelectedRow?.place_nm}
                            options={{
                                isReadOnly: false
                            }}
                            events={{
                                onChange(e) {
                                    handleMaskedInputChange(e);
                                },
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        {/* <MaskedInputField
                            id="area_nm"
                            value={mSelectedRow?.area_nm}
                            options={{
                                isReadOnly: true
                            }}
                        /> */}
                        <ReactSelect
                            id="area_code" label="area_code" dataSrc={area as data}
                            options={{
                                keyCol: "area_code",
                                displayCol: ['area_nm'],
                                defaultValue: mSelectedRow?.area_code,
                                isAllYn: false
                            }}
                            events={{
                                onChange(e) {
                                    handleReactSelectChange(e);
                                },
                            }}
                        />
                    </div>
                    <div className="col-span-4">
                        <MaskedInputField
                            id="addr"
                            value={mSelectedRow?.addr}
                            options={{
                                isReadOnly: false
                            }}
                            events={{
                                onChange(e) {
                                    handleMaskedInputChange(e);
                                },
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="remark"
                            value={mSelectedRow?.remark}
                            options={{
                                isReadOnly: false,
                            }}
                            events={{
                                onChange(e) {
                                    handleMaskedInputChange(e);
                                },
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="create_date"
                            value={mSelectedRow?.create_date}
                            options={{
                                isReadOnly: true,
                                type:"date"
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="update_date"
                            value={mSelectedRow?.update_date}
                            options={{
                                isReadOnly: true,
                                type:"date"
                            }}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;