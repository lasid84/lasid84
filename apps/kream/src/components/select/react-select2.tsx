import React, { FocusEventHandler, KeyboardEventHandler, useEffect, useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { InputActionMeta, default as ReactSelectComponent } from "react-select";
// import { Label, InputWrapper } from "components/react-hook-form"
import { InputWrapper } from "components/wrapper"
import { Label } from "components/label"
import clsx from 'clsx';

const { log } = require('@repo/kwe-lib/components/logHelper');

export type data = {
    data?: {}[],
    field?: any[]
} | undefined;

export type event = {
    onChange: (e:any) => void;
    onFocust: (e:FocusEventHandler<HTMLInputElement>) => void;
    onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
    /** Handle key down events on the select */
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    /** Handle the menu opening */
    onMenuOpen: () => void;
    /** Handle the menu closing */
    onMenuClose: () => void;
    /** Fired when the user scrolls to the top of the menu */
    onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
    /** Fired when the user scrolls to the bottom of the menu */
    onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
}

export type ReactSelectProps = {
    id: string;
    label?: string;
    dataSrc: data;
    width?:string;
    height?:string;
    options?: {
        keyCol?: string;                //dataSrc.data의 키 컬럼, null 일시 0번째를 키 컬럼으로 사용
        displayCol?: string[];          //select의 보여질 컬럼, 여러개 시 col + ' ' + col 로 표현, 없을시 키(daraSrc.data의 0번째 컬럼) + ' ' + daraSrc.data의 1번째 컬럼
        defaultValue?: string;          //초기 선택 값, 빈칸시 첫번째 row
        placeholder?: string;           //
        isMulti?: boolean;
        inline?: boolean;
        isReadOnly?:boolean;            //읽기전용여부
        rules?: Record<string, any>;
        noLabel?:boolean;
        isAllYn?:boolean;
    }
    events?: event
};

export const ReactSelect: React.FC<ReactSelectProps> = (props) => {
    const { control } = useFormContext();
    const { id, label, dataSrc, width, height,  options = {}, events } = props;
    const { keyCol, displayCol, defaultValue, placeholder, isMulti = false, inline = false, rules, noLabel = false, isAllYn = true} = options;
    const [list, setList] = useState<{}[] | undefined>([]);
    const [selectedVal, setSelectedVal] = useState<{} | null>(null);
    const [ firstVal, setFirstVal] = useState('');
    const [ firstLab, setFirstLab] = useState('');
    const defWidth = width ? width : "w-full";
    const defHeight = height ? height : "h-8";

    const { register, setValue, getValues } = useFormContext();

    useEffect(() => {    
        setList(
            dataSrc?.data?.map((item: any, i) => {
                var value = '', label = '';
                if (keyCol) value = item[keyCol];
                else value = item[Object.keys(item)[0]];

                if (!isAllYn && value === 'ALL') return {};

                if (displayCol) {
                    label = '';
                    displayCol.forEach((col) => {
                        if (!label) label = item[col];
                        else label += ' ' + item[col];                       
                    })
                    
                }
                else label = item[Object.keys(item)[1]];

                if (defaultValue) {
                    // log("defaultValue : ", defaultValue);
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
            }).filter(x => x)
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
    }, [firstLab, firstVal]);

    function handleKeyDown(e:any){
        try {
            if (e.key === "Enter") {
                const form = e.target.form;
                log(e.target, form);
                const index = [...form].indexOf(e.target);
                // log(index)
                form[index + 1].focus();
                e.preventDefault();
            }
        
            if (events?.onKeyDown) {
            events.onKeyDown(e);
            }
        } catch (ex) {

        }
      }

    const handleChange = (e:any) => {
        setValue(id, e.value);
        setSelectedVal({value:e.value, label:e.label});

        if (events?.onChange) {
            events.onChange(e);
        }
    }

    const customStyles = {
        control: (base: any) => ({
          ...base,
          minHeight: defHeight,
        }),
        valueContainer: (base: any) => ({
          ...base,
          height: defHeight,
          padding: '0 8px',
        }),
        clearIndicator: (base: any) => ({
          ...base,
        //   padding: `${(30 - 20 - 1 - 1) / 2}px`,
        }),
        dropdownIndicator: (base: any) => ({
          ...base,
        //   padding: `${(30 - 20 - 1 - 1) / 2}px`,
        }),
      };
      

    return (
        <>
            <InputWrapper outerClassName="" inline={inline}>
                {!noLabel && <Label id={id} name={label}  />}
                {/* <div className={clsx(`form-input block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}> */}
                <Controller
                    control={control}
                    name={id}
                    rules={rules}
                    render={({ field: { onChange } }) => {
                        return (
                            <div className="p-1 block w-full flex-grow-1 h-8">
                            {/* <div className={clsx(`block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}> */}
                                <ReactSelectComponent
                                    //{...field}
                                    // defaultValue={{value:'A'}}
                                    value={selectedVal}
                                    isMulti={isMulti}
                                    options={list}
                                    instanceId={id}
                                    // onChange={(e: any) => { onChange(e.value); /*setSelectedVal({value:e.value, label:e.label})*/ }}
                                    onChange={(e:any) => { handleChange(e); }}
                                    onKeyDown={handleKeyDown}
                                    // styles={customStyles}
                                />
                            </div>
                        );
                    }}
                />
                {/* </div> */}
            </InputWrapper>
        </>
    );
};
