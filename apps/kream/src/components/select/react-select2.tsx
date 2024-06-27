import React, { useRef, FocusEventHandler, KeyboardEventHandler, useEffect, useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { InputActionMeta, default as ReactSelectComponent } from "react-select";
// import { Label, InputWrapper } from "components/react-hook-form"
import { InputWrapper } from "components/wrapper"
import { Label } from "components/label"
import clsx from 'clsx';
import './custom-select-style.css';

const { log } = require('@repo/kwe-lib/components/logHelper');

export type data = {
    data?: {}[],
    field?: any[]
} | undefined;

export type event = {
    onChange?: (e: any) => void;
    onFocus?: (e: FocusEventHandler<HTMLInputElement>) => void;
    onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
    /** Handle key down events on the select */
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    /** Handle the menu opening */
    onMenuOpen?: () => void;
    /** Handle the menu closing */
    onMenuClose?: () => void;
    /** Fired when the user scrolls to the top of the menu */
    onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
    /** Fired when the user scrolls to the bottom of the menu */
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
        dialog?: boolean;               // popup listbox 위치 배치 boolean
        keyCol?: string;                //dataSrc.data의 키 컬럼, null 일시 0번째를 키 컬럼으로 사용
        displayCol?: string[];          //select의 보여질 컬럼, 여러개 시 col + ' ' + col 로 표현, 없을시 키(daraSrc.data의 0번째 컬럼) + ' ' + daraSrc.data의 1번째 컬럼
        defaultValue?: string;          //초기 선택 값, 빈칸시 첫번째 row
        placeholder?: string;           //
        isMulti?: boolean;
        inline?: boolean;
        isReadOnly?: boolean;            //읽기전용여부
        rules?: Record<string, any>;
        noLabel?: boolean;
        isAllYn?: boolean;
    }
    events?: event
};

export const ReactSelect: React.FC<ReactSelectProps> = (props) => {
    const { control } = useFormContext();
    const { id, label, dataSrc, width, height, lwidth, options = {}, events } = props;
    const { dialog = false, keyCol, displayCol, defaultValue, placeholder, isMulti = false, inline = false, rules, noLabel = false, isAllYn = true } = options;
    const [list, setList] = useState<{}[] | undefined>([]);
    const [selectedVal, setSelectedVal] = useState<{} | null>(null);
    const [firstVal, setFirstVal] = useState('');
    const [firstLab, setFirstLab] = useState('');
    const defWidth = width ? width : "w-full";
    const defHeight = height ? height : "h-6";
    // const ref = React.useRef(null)
    const ref = useRef<HTMLDivElement>(null)

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
    }, [dataSrc, defaultValue]);

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

    // function handleKeyDown(e: any) {
    //     try {
    //             const menu = ref.current.select.menuListRef;
    //             const options = menu.querySelectorAll(".my-select__option");
    //             console.log('enter', options)

    //             options.forEach((option, index) => {
    //                 console.log('enter?',options)
    //               new ClassWatcher(
    //                 option,
    //                 "my-select__option--is-focused",
    //                 () => setFocusedValue(OPTIONS[index].value),
    //                 () => {}
    //               );
    //             });              

    //         if (e.key === "Enter") {
    //             const form = e.target.form;
    //             log('enter event1', e);
    //             const index = [...form].indexOf(e.target);
    //             log('enter event', index)
    //             form[index + 1].focus();
    //             e.preventDefault();
    //         }

    //         if (events?.onKeyDown) {
    //             events.onKeyDown(e);
    //         }
    //     } catch (ex) {

    //     }
    // }

    const handleChange = (e: any) => {
        setValue(id, e.value);
        setSelectedVal({ id:id, value: e.value, label: e.label });
        let dispCol = displayCol?.length 
                    ? displayCol[displayCol?.length-1] : (dataSrc?.data ? Object.keys(dataSrc?.data[0])[1] : '') ;

        if (events?.onChange) {
            events.onChange({[id]:e.value, [dispCol]:e.label});
        }
    }



    const customStyles = {
        control: (base: any) => ({
            ...base,
            //   padding : "1px",
            minHeight: defHeight,
            height: "30px",
            fontSize: 13,
            border: "1px solid #e5e7eb",
            borderRadius: "0rem",
            boxShadow: "none",
            "&:hover": {
                border: "1px solid #e5e7eb",
            },
            //zIndex : 1
            //   justifycontent : 
            //   border: "0 !important",
            //   boxShadow: "0 !important",
            //   "&:hover": {
            //     border: "0 !important"
            //   }
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
                {!noLabel && <Label id={id} name={label} lwidth={lwidth} />}
                {dialog ?
                    <Controller
                        control={control}
                        name={id}
                        rules={rules}
                        render={({ field: { onChange, /*onKeyDown*/ } }) => {
                            return (
                                <div className={`my-react-select-container flex-row ${defWidth} flex-grow-1`}>
                                    <ReactSelectComponent
                                        // ref={ref}
                                        id={id}
                                        classNamePrefix="my-react-select"
                                        value={selectedVal}
                                        isMulti={isMulti}
                                        options={list}
                                        instanceId={id}
                                        onChange={(e: any) => { handleChange(e); }}
                                        menuPortalTarget={document.getElementsByClassName('dialog-base')[0] as HTMLElement}
                                        menuPosition='fixed'
                                        styles={customStyles}
                                    />
                                </div>
                            );
                        }}
                    />
                    :
                    <Controller
                        control={control}
                        name={id}
                        rules={rules}
                        render={({ field: { onChange, /*onKeyDown*/ } }) => {
                            return (
                                <div className={`my-react-select-container w-96 inline-block ${defWidth} flex-grow-1`}>
                                    <ReactSelectComponent
                                        // ref={ref}
                                        classNamePrefix="my-react-select"
                                        value={selectedVal}
                                        isMulti={isMulti}
                                        options={list}
                                        instanceId={id}
                                        onChange={(e: any) => { handleChange(e); }}
                                        styles={customStyles}
                                    />
                                </div>
                            );
                        }}
                    />
                }
            </InputWrapper>
        </>
    );
};
