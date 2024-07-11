import React, { useRef, FocusEventHandler, KeyboardEventHandler, useEffect, useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { InputActionMeta, default as ReactSelectComponent } from "react-select";
import { MultiValue, SingleValue, ActionMeta } from 'react-select';
import { InputWrapper } from "components/wrapper";
import { Label } from "components/label";
import clsx from 'clsx';
import './custom-select-style.css';

const { log } = require('@repo/kwe-lib/components/logHelper');

interface MyOptionType {
    value: string;
    label: string;
}

export type data = {
    data?: {}[],
    field?: any[]
} | undefined;

export type event = {
    onChange?: (e: any) => void;
    onFocus?: (e: FocusEventHandler<HTMLInputElement>) => void;
    onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
    onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
}

export type ReactSelectProps = {
    id: string;
    dataSrc: data;
    label?: string;
    width?: string;
    height?: string;
    lwidth?: string;
    options?: {
        dialog?: boolean;
        keyCol?: string;
        displayCol?: string[];
        defaultValue?: string | string[]; // Allow defaultValue to be string or array of strings
        placeholder?: string;
        isMulti?: boolean;
        inline?: boolean;
        isReadOnly?: boolean;
        rules?: Record<string, any>;
        noLabel?: boolean;
        isAllYn?: boolean;
        isDisplay?: boolean;
    }
    events?: event
};

export const ReactMultiSelect: React.FC<ReactSelectProps> = (props) => {
    const { control } = useFormContext();
    const { id, label, dataSrc, width, height, lwidth, options = {}, events } = props;
    const { dialog = false, keyCol, displayCol, defaultValue, placeholder, isMulti = false, inline = false, rules, noLabel = false, isAllYn = true, isDisplay = true } = options;
    const [list, setList] = useState<MyOptionType[] | undefined>([]);
    const [selectedVals, setSelectedVals] = useState<MyOptionType[]>([]); // Use array for selected values
    const [firstVals, setFirstVals] = useState<string[]>([]); // Use array for initial values
    const [firstLabs, setFirstLabs] = useState<string[]>([]); // Use array for initial labels
    const defWidth = width ? width : "w-full";
    const defHeight = height ? height : "h-6";
    const display = isDisplay ? '' : 'block hidden ';
    const ref = useRef<HTMLDivElement>(null)

    const { register, setValue, getValues } = useFormContext();

    useEffect(() => {
        setList(
            dataSrc?.data?.map((item: any, i) => {
                var value = keyCol ? item[keyCol] : item[Object.keys(item)[0]];

                if (!isAllYn && value === 'ALL') return {} as MyOptionType;

                return { value: value, label: value }; // label에 value를 사용하여 key만 표시
            }).filter(x => x) as MyOptionType[]
        );
    }, [dataSrc]);

    useEffect(() => {
        if (defaultValue) {
            // defaultValue가 문자열이면 쉼표로 구분하여 배열로 변환
            const defaultValues = typeof defaultValue === 'string' ? defaultValue.split(',').map(val => val.trim()) : defaultValue;

            dataSrc?.data?.forEach((item: any) => {
                var value = keyCol ? item[keyCol] : item[Object.keys(item)[0]];

                if (defaultValues.includes(value)) {
                    setFirstVals(prev => [...prev, value]);
                    setFirstLabs(prev => [...prev, value]); // label에 value를 사용하여 key만 표시
                }
            });
        }
    }, [dataSrc, defaultValue]);

    useEffect(() => {
        if (firstVals.length > 0 && firstLabs.length > 0) {
            const selectedValues = firstVals.map((value, index) => ({
                value: value,
                label: firstLabs[index]
            }));
            setSelectedVals(selectedValues);
            setValue(id, isMulti ? selectedValues : selectedValues[0]?.value); // Ensure to set the correct value or array of values
        }
    }, [firstVals, firstLabs]);

    function handleKeyDown(e: any) {
        try {
            if (e.key === "Enter") {
                const form = e.target.form;
                const index = [...form].indexOf(e.target);
                form[index + 1].focus();
                e.preventDefault();
            }

            if (events?.onKeyDown) {
                events.onKeyDown(e);
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    const handleChange = (
        newValue: MultiValue<MyOptionType> | SingleValue<MyOptionType>,
        actionMeta: ActionMeta<MyOptionType>
    ): void => {
        // newValue가 배열인지 확인하여 MultiValue와 SingleValue를 구분
        const selectedItems = Array.isArray(newValue) ? newValue : [newValue];

        // null 값 필터링
        const validItems = selectedItems.filter(item => item !== null) as MyOptionType[];

        // 쉼표로 구분된 문자열을 생성
        const joinedValues = validItems.map(item => item.value).join(',');
        log('joinedValues', joinedValues)

        // 쉼표로 구분된 문자열을 배열로 변환
        const parsedItems = validItems.flatMap(item => item.value.split(',').map(value => ({
            value: value.trim(),
            label: value.trim() // label에 value를 사용하여 key만 표시
        })));

        setSelectedVals(parsedItems);
        setValue(id, isMulti ? parsedItems : parsedItems[0]?.value); // Ensure to set the correct value or array of values

        if (events?.onChange) {
            let dispCol = displayCol?.length
                ? displayCol[displayCol.length - 1]
                : (dataSrc?.data ? Object.keys(dataSrc.data[0])[1] : '');
            events.onChange(parsedItems.map(selected => ({ [id]: selected.value, [dispCol]: selected.label })));
        }
    };

    const customStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: defHeight,
            height: "30px",
            fontSize: 13,
            border: "1px solid #e5e7eb",
            borderRadius: "0rem",
            boxShadow: "none",
            "&:hover": {
                border: "1px solid #e5e7eb",
            },
        }),
        valueContainer: (base: any) => ({
            ...base,
            height: "30px",
            justifyContent: "center",
        }),
        indicatorSeparator: (base: any) => ({
            ...base,
            display: "none"
        }),
        clearIndicator: (base: any) => ({
            ...base,
            display: "none",
        }),
        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            padding: `${(30 - 20 - 1 - 1) / 2}px`,
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none'
        }),
    };

    return (
        <>
            <InputWrapper outerClassName="" inline={inline} >
                {!noLabel && <Label id={id} name={label} lwidth={lwidth} isDisplay={isDisplay} />}
                {dialog ?
                    <Controller
                        control={control}
                        name={id}
                        rules={rules}
                        render={({ field: { onChange } }) => (
                            <div className={`${display} my-react-select-container flex-row ${defWidth} flex-grow-1`}>
                                <ReactSelectComponent
                                    id={id}
                                    classNamePrefix="my-react-select"
                                    value={selectedVals}
                                    isMulti={isMulti}
                                    options={list}
                                    instanceId={id}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    menuPortalTarget={document.getElementsByClassName('dialog-base')[0] as HTMLElement}
                                    menuPosition='fixed'
                                    styles={customStyles}
                                />
                            </div>
                        )}
                    />
                    :
                    <Controller
                        control={control}
                        name={id}
                        rules={rules}
                        render={({ field: { onChange } }) => (
                            <div className={`${display} my-react-select-container w-96 inline-block ${defWidth} flex-grow-1`}>
                                <ReactSelectComponent
                                    id={id}
                                    classNamePrefix="my-react-select"
                                    value={selectedVals}
                                    isMulti={isMulti}
                                    options={list}
                                    instanceId={id}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    styles={customStyles}
                                />
                            </div>
                        )}
                    />
                }
            </InputWrapper>
        </>
    );
}
