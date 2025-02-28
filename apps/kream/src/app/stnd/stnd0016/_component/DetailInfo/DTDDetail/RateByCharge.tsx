import { useEffect, useReducer, useMemo, useCallback, useRef, memo, useState, FocusEvent, Fragment } from "react";
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

type innerProps = {
    col: string;
    onChange?: (rate:any, charge_type: string, col: string, value: string | null ) => void;
};

const defualTitleWidth = "w-[120px]";
const defaultLabelWidth = "w-20"
const defaultInputWidth = "w-20"
const defaultHeight = "h-6"

const RateByCharge: React.FC<Props> = memo(() => {
    const {t} = useTranslation();

    const { chargeTypeSeq } = useCommonStore((state) => state);
    
    const handleChange = (rate: any, charge_type: string, col: string, value: string | null) => {
        if (rate[col] !== value) {
            rate[col] = value;
            rate[ROW_CHANGED] = true;
        }
    }

    const components: Record<string, React.FC<innerProps>> = {
        'customs_clearance' : Clearance,
        'dtd_handling'      : DTDHandling,
        'bl_handling'       : AirFreight,
        'air_freight'       : CCFee,
        'other_2'           : Other2,
        'special_handling'  : SpecialHandling,
    }


    return (
        <div className="flex flex-col gap-1 p-2 m-1 md:grid md:grid-cols-1">
            {chargeTypeSeq ? 
            chargeTypeSeq.map((row:any,idx:number) => {
                const { charge_type } = row
                const Component = components[charge_type];

                if (!Component) return;
                return (
                    <Fragment key={idx}>
                        <Component onChange={handleChange} col={charge_type} />
                    </Fragment>
                );
            })
            : Object.entries(components).map((item, idx) => {
                const [charge_type, Component] = item;
                return (
                    <Fragment key={idx}>
                        <Component onChange={handleChange} col={charge_type} />
                    </Fragment>
                )
            })
            }
        </div>
    );
});

const getChargeInfo = (col_nm: string) => {
    const { dtdChargeData } = useCommonStore((state) => state);
    // const charge_type = dtdChargeData?.data.filter((row:any) => row.category = 'RV')[0][col_nm];

    // const rate = dtdChargeRateData?.[col_nm];
    const rate = dtdChargeData?.data.filter((row:any) => row['charge_type'] === col_nm)[0];
    // log("getChargeInfo", rate)

    return {
        // charge_type,
        rate
    }
}

const getColName = (category:string) => {
    return [
        category + '_type',
        category + '_rate',
        category + '_amt',
        category + '_min',
        category + '_max',
        category + '_etc',
    ]
}

const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    // log("handleFocus", e)
    e.target.select();
}

//통관료
const Clearance: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { col, onChange: handleChange } = props
    
    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);
    
    // if (selectedCell !== 'customs_clearance') return;

    return (
        <>
            <div className={`flex flex-row gap-2 ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'customs_clearance'} freeStyle={defualTitleWidth + ' ' + defaultHeight}/>
                <MaskedInputField
                    id={current_col + '_rate'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colRate]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right',
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colRate, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="%" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_min'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colMin]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colMin, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_max'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colMax]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colMax, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>

                <MaskedInputField
                    id={current_col + '_amt'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colAmt]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colAmt, e.target.value);
                        },
                        onFocus:handleFocus
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
    const { col, onChange: handleChange } = props
    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);
    // log(current_col, colEtc, rate)
    // if (selectedCell !== 'dtd_handling') return;

    return (
        <>
            <div className={`flex flex-row gap-2 ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'dtd_handling'} freeStyle={defualTitleWidth + ' ' + defaultHeight} />
                <MaskedInputField
                    id={current_col + '_amt'}
                    label={'기본'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colAmt]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colAmt, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                <MaskedInputField
                    id={current_col + '_etc_overtime'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colEtc]?.overtime}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            const newEtc = {
                                ...rate?.[colEtc],
                                overtime: e.target.value
                            }
                            handleChange?.(rate, current_col, colEtc, newEtc);
                        },
                        onFocus:handleFocus
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
    const { col, onChange: handleChange } = props

    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);
    // if (selectedCell !== 'bl_handling') return;
    // log(current_col, rate, colAmt)
    return (
        <>
            <div className={`flex flex-row gap-2 
                        ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'bl_handling'} freeStyle={defualTitleWidth + ' ' + defaultHeight}  />
                <MaskedInputField
                    id={current_col + '_amt'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colAmt]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colAmt, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//CC Fee
const CCFee: React.FC<innerProps> = (props) => {
    const { loadDatas, selectedCharge: col_nm } = useCommonStore((state) => state);
    const { col, onChange: handleChange } = props
    const [selectedType, setSelectedType] = useState("No");

    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);

    useEffect(() => {
        if (rate) typeHandler(rate[colType])
    }, [rate])

    const typeHandler = (value: string) => {
        const group = loadDatas?.[6].data.find((arr: { [x: string]: string; }) => arr['cd'] === value) || {};
        setSelectedType(group['type_group']);
    }

    // if (selectedCell !== 'air_freight') return;

    return (
        <>
            <div className={`flex flex-row gap-2
                        ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={'ccfee'} freeStyle={defualTitleWidth + ' ' + defaultHeight}  />
                <ReactSelect
                    id={current_col + '_type'} dataSrc={loadDatas?.[6] as gridData}
                    height={'24px'}
                    // width="w-full"
                    width={"185px"}
                    lwidth={defaultLabelWidth}
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd_nm'],
                        defaultValue: rate?.[colType],
                        isAllYn: false,
                        inline:true
                    }}
                    events={{
                        onChange(e, id, value) {
                            typeHandler(value);
                            handleChange?.(rate, current_col, colType, value);
                        },
                    }}
                /> 
                <div className={`flex flex-row ${selectedType !== 'Rate' ? 'hidden' : ''} gap-2`}>
                    <MaskedInputField
                        id={current_col + '_rate'}
                        height={defaultHeight}
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.[colRate]}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            noLabel: true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(rate, current_col, colRate, e.target.value);
                            },
                            onFocus:handleFocus
                        }}
                    />
                    <Label id={'lbl1'} name="%" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                    <MaskedInputField
                        id={current_col + '_min'}
                        height={defaultHeight}
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.[colMin]}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(rate, current_col, colMin, e.target.value);
                            },
                            onFocus:handleFocus
                        }}
                    />
                    <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                </div>

                <div className={`flex flex-row ${selectedType !== 'Fixed' ? 'hidden' : ''} gap-2`}>
                    <MaskedInputField
                        id={current_col + '_amt'}
                        height={defaultHeight}
                        width={defaultInputWidth}
                        lwidth={defaultLabelWidth}
                        value={rate?.[colAmt]}
                        options={{
                            isReadOnly: false,
                            inline:true,
                            type: 'number',
                            textAlign: 'right'
                        }}
                        events={{
                            onChange(e, dataType) {
                                handleChange?.(rate, current_col, colAmt, e.target.value);
                            },
                            onFocus:handleFocus
                        }}
                    />
                    <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
                </div>
            </div>
        </>
    )
}

//항공수수료
const Other2: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { col, onChange: handleChange } = props

    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);
    // if (selectedCell !== 'bl_handling') return;
    // log(current_col, rate, colAmt)
    return (
        <>
            <div className={`flex flex-row gap-2 
                        ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={current_col} freeStyle={defualTitleWidth + ' ' + defaultHeight}  />
                <MaskedInputField
                    id={current_col + '_amt'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colAmt]}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            handleChange?.(rate, current_col, colAmt, e.target.value);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//특별통관료
const SpecialHandling: React.FC<innerProps> = (props) => {
    const { selectedCharge: col_nm } = useCommonStore((state) => state);
    const { col, onChange: handleChange } = props
    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax, colEtc] = getColName(category);
    // log(current_col, colEtc, rate)
    // if (selectedCell !== 'dtd_handling') return;

    return (
        <>
            <div className={`flex flex-row gap-2 ${col_nm === current_col ? 'border border-red-500' : ''}`}>
                <LabelGrid id={current_col} freeStyle={defualTitleWidth + ' ' + defaultHeight}  />
                <MaskedInputField
                    id={current_col + '_etc_overtime'}
                    height={defaultHeight}
                    width={defaultInputWidth}
                    lwidth={defaultLabelWidth}
                    value={rate?.[colEtc]?.overtime}
                    options={{
                        isReadOnly: false,
                        inline:true,
                        type: 'number',
                        textAlign: 'right'
                    }}
                    events={{
                        onChange(e, dataType) {
                            const newEtc = {
                                ...rate?.[colEtc],
                                overtime: e.target.value
                            }
                            handleChange?.(rate, current_col, colEtc, newEtc);
                        },
                        onFocus:handleFocus
                    }}
                />
                <Label id={'lbl1'} name="won" margin="ml-0" isDisplay={true} lwidth="w-[5px]"/>
            </div>
        </>
    )
}

//운송료
const Trucking: React.FC<innerProps> = (props) => {
    const { col, onChange: handleChange } = props
    const transFeeDatas = useCommonStore((state) => state);
    const current_col = col;
    const category = 'rv';
    const { rate } = getChargeInfo(current_col);
    
    const [colType, colRate, colAmt, colMin, colMax] = getColName(category);

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