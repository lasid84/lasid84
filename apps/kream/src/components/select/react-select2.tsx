import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { default as ReactSelectComponent } from "react-select";
// import { Label, InputWrapper } from "components/react-hook-form"
import { InputWrapper } from "components/wrapper"
import { Label } from "components/label"

const { log } = require('@repo/kwe-lib/components/logHelper');

export type data = {
    data?: {}[],
    field?: any[]
} | undefined;

export type ReactSelectProps = {
    id: string;
    label?: string;
    dataSrc: data;
    options?: {
        keyCol?: string;                //dataSrc.data의 키 컬럼, null 일시 0번째를 키 컬럼으로 사용
        displayCol?: string[];          //select의 보여질 컬럼, 여러개 시 col + ' ' + col 로 표현, 없을시 키(daraSrc.data의 0번째 컬럼) + ' ' + daraSrc.data의 1번째 컬럼
        defaultValue?: string;          //초기 선택 값, 빈칸시 첫번째 row
        placeholder?: string;           //
        isMulti?: boolean;
        inline?: boolean;
        rules?: Record<string, any>;
    }
};

export const ReactSelect: React.FC<ReactSelectProps> = (props) => {
    const { control } = useFormContext();
    const { id, label, dataSrc, options = {} } = props;
    const { keyCol, displayCol, defaultValue, placeholder, isMulti = false, inline = false, rules} = options;
    const [list, setList] = useState<{}[] | undefined>([]);
    const [selectedVal, setSelectedVal] = useState<{} | null>(null);
    const [ firstVal, setFirstVal] = useState('');
    const [ firstLab, setFirstLab] = useState('');

    const { register, setValue, getValues } = useFormContext();

    useEffect(() => {    
        setList(
            dataSrc?.data?.map((item: any, i) => {
                var value = '', label = '';
                if (keyCol) value = item[keyCol];
                else value = item[Object.keys(item)[0]];

                if (displayCol) {
                    label = '';
                    displayCol.forEach((col) => {
                        if (!label) label = item[col];
                        else label += ' ' + item[col];                       
                    })
                    
                }
                else label = item[Object.keys(item)[1]];

                if (defaultValue) {
                    if (value === defaultValue) {
                        setFirstVal(value);
                        setFirstLab(label);
                    };
                } else {
                    if (i === 0) {
                        setFirstVal(value);
                        setFirstLab(label);
                    }
                }
                
                return { value: value, label: label };
            })
        );
    }, [dataSrc]);

    useEffect(() => {
        // log(firstLab, firstVal)
        if (firstLab && firstVal) {
            setSelectedVal({
                label: firstLab,
                value: firstVal,
            });
            setValue(id, firstVal);
        }
    }, [firstLab, firstVal])

    const handleChange = (e:any) => {
        setValue(id, e.value);
        setSelectedVal({value:e.value, label:e.label});
    }

    return (
        <>
            <InputWrapper outerClassName="" inline={inline}>
                <Label id={id} name={label}  />
                <Controller
                    control={control}
                    name={id}
                    rules={rules}
                    render={({ field: { onChange } }) => {
                        return (
                            <div className="block w-full flex-grow-1">
                                <ReactSelectComponent
                                    //{...field}
                                    // defaultValue={{value:'A'}}
                                    value={selectedVal}
                                    isMulti={isMulti}
                                    options={list}
                                    instanceId={id}
                                    // onChange={(e: any) => { onChange(e.value); /*setSelectedVal({value:e.value, label:e.label})*/ }}
                                    onChange={(e:any) => { handleChange(e); }}
                                    // onChange={(e:any) => { setSelectedVal({value:e.value, label:e.label}) }}
                                />
                            </div>
                        );
                    }}
                />
            </InputWrapper>
        </>
    );
};
