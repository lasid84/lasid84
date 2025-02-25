import { useEffect, useReducer, useMemo, useCallback, useRef, memo, useState } from "react";
import { useCommonStore } from "../../../_store/store";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { ReactSelect } from "@/components/select/react-select2";
import TruckingChargeGrid from "./TruckingChargeGrid";
import { gridData, ROW_CHANGED } from "@/components/grid/ag-grid-enterprise";
import { Label, LabelGrid } from "@/components/label";
import { useTranslation } from "react-i18next";

import { log } from '@repo/kwe-lib-new';
import { RowContainerComp } from "ag-grid-community";

type Props = {
};

type Rate = {
     [x: string]: { [key: string]: any; } 
}
const defualTitleWidth = "w-[120px]";
const defaultLabelWidth = "w-20"
const defaultInputWidth = "w-20"

const RateByCharge: React.FC<Props> = memo(() => {
    const {t} = useTranslation();
    const { dtdChargeRateData } = useCommonStore((state) => state);
    
    const handleChange = (charge_type: string, col: string, value: string | null) => {
        if (dtdChargeRateData && dtdChargeRateData[charge_type]) {
            dtdChargeRateData[charge_type][col] = value;
            dtdChargeRateData[ROW_CHANGED] = true;
          }
    }

    return (
        <div className="flex flex-col gap-2 p-2 m-1 md:grid md:grid-cols-1">
            <Clearance onChange={handleChange}/>
            <DTDHandling onChange={handleChange}/>
            <AirFreight onChange={handleChange}/>
            <CCFee onChange={handleChange}/>
        </div>
    );
});

type innerProps = {
    onChange?: (charge_type: string, col: string, value: string | null ) => void;
};

const getChargeInfo = (col_nm: string) => {
    const { dtdChargeData, dtdChargeRateData } = useCommonStore((state) => state);
    // const charge_type = dtdChargeData?.data.filter((row:any) => row.category = 'RV')[0][col_nm];
    const rate = dtdChargeRateData?.[col_nm];

    return {
        // charge_type,
        rate
    }
}

//통관료
const Clearance: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { onChange: handleChange } = props
    
    const current_col = 'customs_clearance_rv';
    const { rate } = getChargeInfo(current_col);
    
    // if (selectedCell !== 'customs_clearance') return;

    return (
        <>
            <div className={`flex flex-row gap-2 ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'customs_clearance'} freeStyle={defualTitleWidth}/>
                <MaskedInputField
                    id={current_col + '_rate'}
                    height="h-8"
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.rate}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right',
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(current_col, 'rate', e.target.value);
                        },
                    }}
                />
                <Label id={'lbl1'} name="%" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_min'}
                    height='h-8'
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.min}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(current_col, 'min', e.target.value);
                        },
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_max'}
                    height="h-8"
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.max}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(current_col, 'max', e.target.value);
                        },
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//업무대행 수수료
const DTDHandling: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { onChange: handleChange } = props
    const current_col = 'dtd_handling_rv';
    const { rate } = getChargeInfo(current_col);
    // if (selectedCell !== 'dtd_handling') return;

    return (
        <>
            <div className={`flex flex-row gap-2 ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'dtd_handling'} freeStyle={defualTitleWidth} />
                <MaskedInputField
                    id={current_col + '_amt'}
                    label={'기본'}
                    height='h-8'
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.amt}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(current_col, 'amt', e.target.value);
                        },
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_etc_overtime'}
                    height="h-8"
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.etc?.overtime}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            const newEtc = {
                                ...rate?.etc,
                                overtime: e.target.value
                            }
                            handleChange?.(current_col, 'etc', newEtc);
                        },
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//항공수수료
const AirFreight: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { onChange: handleChange } = props

    const current_col = 'bl_handling_rv';
    const { rate } = getChargeInfo(current_col);
    // if (selectedCell !== 'bl_handling') return;

    return (
        <>
            <div className={`flex flex-row gap-2 
                        ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'bl_handling'} freeStyle={defualTitleWidth}  />
                <MaskedInputField
                    id={current_col + '_amt'}
                    height="h-8"
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.amt}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(current_col, 'amt', e.target.value);
                        },
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//CC Fee
const CCFee: React.FC<innerProps> = (props) => {
    const {  loadDatas, selectedCharge: col_nm } = useCommonStore((state) => state);
    const { onChange: handleChange } = props
    const [selectedType, setSelectedType] = useState("No");

    const current_col = 'air_freight_rv';
    const { rate } = getChargeInfo(current_col);

    useEffect(() => {
        if (rate) typeHandler(rate.type)
    }, [rate])

    const typeHandler = (value: string) => {
        const group = loadDatas?.[6].data.find((arr: { [x: string]: string; }) => arr['cd'] === value);
        setSelectedType(group['type_group']);
        handleChange?.(current_col, 'type', value);
    }

    // if (selectedCell !== 'air_freight') return;

    return (
        <>
            <div className={`flex flex-row gap-2
                        ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'ccfee'} freeStyle={defualTitleWidth}  />
                <ReactSelect
                    id={current_col + '_type'} dataSrc={loadDatas?.[6] as gridData}
                    height="h-8"
                    // width="w-full"
                    width={"185px"}
                    lwidth={defaultLabelWidth}
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd_nm'],
                        defaultValue: rate?.type,
                        isAllYn: false,
                        inline:true
                    }}
                    events={{
                        onChange(e, id, value) {
                            typeHandler(value);
                            handleChange?.(current_col, 'type', value);
                        },
                    }}
                /> 
                <div className={`flex flex-row ${selectedType !== 'Rate' ? 'hidden' : ''} gap-2`}>
                    <MaskedInputField
                        id={current_col + '_rate'}
                        height="h-8"
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.rate}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            noLabel: true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(current_col, 'rate', e.target.value);
                            },
                        }}
                    />
                    <Label id={'lbl1'} name="%" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                    <MaskedInputField
                        id={current_col + '_min'}
                        height="h-8"
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.min}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(current_col, 'min', e.target.value);
                            },
                        }}
                    />
                    <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                </div>

                <div className={`flex flex-row ${selectedType !== 'Fixed' ? 'hidden' : ''} gap-2`}>
                    <MaskedInputField
                        id={current_col + '_amt'}
                        height="h-8"
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.amt}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(current_col, 'amt', e.target.value);
                            },
                        }}
                    />
                    <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                </div>
            </div>
        </>
    )
}

//운송료
const Trucking: React.FC<innerProps> = (props) => {
    const { onChange: handleChange } = props
    const transFeeDatas = useCommonStore((state) => state);

    // if (selectedCell !== 'trucking') return;

    useEffect(() => {
        // 운임료 조회
    }, [])

    return (
        <>
            <TruckingChargeGrid />
        </>
    )
}

export default RateByCharge;