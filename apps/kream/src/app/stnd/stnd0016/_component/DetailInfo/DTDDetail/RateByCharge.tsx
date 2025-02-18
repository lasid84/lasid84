import { useEffect, useReducer, useMemo, useCallback, useRef, memo, useState } from "react";
import { useCommonStore } from "../../../_store/store";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { ReactSelect } from "@/components/select/react-select2";
import TruckingChargeGrid from "./TruckingChargeGrid";
import { gridData } from "@/components/grid/ag-grid-enterprise";

type Props = {
};

const RateByCharge: React.FC<Props> = memo(() => {

    const selectedCharge = useCommonStore((state) => state.selectedCharge);
    // customs_clearance dtd_handling air_freight ccfee trucking
    // const selectedCell = "customs_clearance";

    return (
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-1 m-1">
            <Clearance selectedCell={selectedCharge} />
            <DTDHandling selectedCell={selectedCharge} />
            <AirFreight selectedCell={selectedCharge} />
        </div>
    );
});


type innerProps = {
    selectedCell?: string | null
};

//통관료
const Clearance: React.FC<innerProps> = (props) => {
    const { selectedCell } = props

    if (selectedCell !== 'customs_clearance') return;

    return (
        <>
            <div className="flex flex-row gap-2">
                <MaskedInputField
                    id="CIF Value *"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
                <MaskedInputField
                    id="Min"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
                <MaskedInputField
                    id="Max"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
            </div>
        </>
    )
}

//업무대행 수수료
const DTDHandling: React.FC<innerProps> = (props) => {
    const { selectedCell } = props

    if (selectedCell !== 'dtd_handling') return;

    return (
        <>
            <div className="flex flex-row gap-2">
                <MaskedInputField
                    id="기본"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
                <MaskedInputField
                    id="개청시"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
            </div>
        </>
    )
}

//항공수수료
const AirFreight: React.FC<innerProps> = (props) => {
    const { selectedCell } = props

    if (selectedCell !== 'air_freight') return;

    return (
        <>
            <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-6">
                <MaskedInputField
                    id="기본"
                    height="h-8"
                    // value={mainSelectedRow?.cust_code}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />
            </div>
            <CCFee/>
        </>
    )
}

//CC Fee
const CCFee: React.FC<innerProps> = (props) => {
    const { selectedCell } = props
    const loadDatas = useCommonStore((state) => state.loadDatas);
    const [selectedType, setSelectedType] = useState("No");

    // if (selectedCell !== 'ccfee') return;

    return (
        <>
            <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-6">
                <ReactSelect
                    id="ccfee_type" dataSrc={loadDatas?.[6] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd', 'cd_nm'],
                        defaultValue: '',
                        isAllYn: false,
                        inline:true
                    }}
                    events={{
                        onChange(e, id, value) {
                            const group = loadDatas?.[6].data.find((arr: { [x: string]: string; }) => arr['cd'] === value);
                            setSelectedType(group['type_group']);
                        },
                    }}
                /> 
                <div className={`flex flex-row col-span-3 ${selectedType !== 'Rate' ? 'hidden' : ''}`}>
                    <MaskedInputField
                        id="Rate"
                        height="h-8"
                        // value={mainSelectedRow?.cust_code}
                        options={{
                            isReadOnly: false,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                    <MaskedInputField
                        id="Min"
                        height="h-8"
                        // value={mainSelectedRow?.cust_code}
                        options={{
                            isReadOnly: false,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>

                <div className={`flex flex-row col-span-1 ${selectedType !== 'Fixed' ? 'hidden' : ''}`}>
                    <MaskedInputField
                        id="Fixed"
                        height="h-8"
                        // value={mainSelectedRow?.cust_code}
                        options={{
                            isReadOnly: false,
                            inline:true
                        }}
                        events={{
                            // onChange: onChangedData
                        }}
                    />
                </div>

            </div>
        </>
    )
}

//운송료
const Trucking: React.FC<innerProps> = (props) => {
    const { selectedCell } = props
    const transFeeDatas = useCommonStore((state) => state);

    if (selectedCell !== 'trucking') return;

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