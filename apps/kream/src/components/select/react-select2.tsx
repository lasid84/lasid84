import React, { useRef, FocusEventHandler, KeyboardEventHandler, useEffect, useState, memo } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { InputActionMeta, default as ReactSelectComponent, MenuProps } from "react-select";
import { InputWrapper } from "components/wrapper"
import { Label } from "components/label"
import './custom-select-style.css';

import { log, error } from '@repo/kwe-lib-new';
import { gridData } from '../grid/ag-grid-enterprise';

// export type data = {
//     data?: {}[],
//     field?: any[]
// } | undefined;

export type data = gridData;

export type event = {
    onChange?: (e: any, id:string, value:string) => void;
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
    dataSrc: gridData | undefined;
    label?: string;
    width?: string;
    height?: string;
    lwidth?: string;
    options?: {
        dialog?: boolean;               // popup listbox 위치 배치 boolean
        keyCol?: string;                //dataSrc.data의 키 컬럼, null 일시 0번째를 키 컬럼으로 사용
        displayCol?: string[];          //select의 보여질 컬럼, 여러개 시 col + ' ' + col 로 표현, 없을시 키(daraSrc.data의 0번째 컬럼) + ' ' + daraSrc.data의 1번째 컬럼
        defaultValue?: string | null;          //초기 선택 값, 빈칸시 첫번째 row
        placeholder?: string;           //
        isMulti?: boolean;
        inline?: boolean;
        isReadOnly?: boolean;            //읽기전용여부
        rules?: Record<string, any>;
        noLabel?: boolean;
        isAllYn?: boolean;
        isDisplay?: boolean;            //사용자 권한에 따른 display여부
        isMandatory?: boolean;          //필수값 여부
    }
    events?: event
};

export const ReactSelect: React.FC<ReactSelectProps> = memo((props) => {
    const { control } = useFormContext();
    const { id, label, dataSrc, width, height, lwidth, options = {}, events } = props;
    const { dialog = false, keyCol, displayCol, defaultValue, placeholder, isMulti = false, inline = false, rules, noLabel = false, isAllYn = true, isDisplay=true,
        isMandatory=true, isReadOnly=false
     } = options;
    const [list, setList] = useState<{}[] | undefined>([]);
    const [selectedVal, setSelectedVal] = useState<{} | null>(null);
    const [firstVal, setFirstVal] = useState('');
    const [firstLab, setFirstLab] = useState('');
    const defWidth = width ? width : "w-full";
    const defHeight = height ? height : "30px";
    const display = isDisplay? '':'block hidden ';
    // const ref = React.useRef(null)
    const ref = useRef<any>(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [delayEnter, setDelayEnter] = useState(false);
    const [isChangeFinish, setisChangeFinish] = useState(false);
    const [target, setTarget] = useState(null);

    const { register, setValue, getValues } = useFormContext();


    // useEffect(() => {
    //     log("defaultValue123", defaultValue);
    // }, [defaultValue]);

    useEffect(() => {
        setList(
            dataSrc?.data?.map((item: any, i:any) => {
                var value = '', label = '';
                if (keyCol) value = item[keyCol];
                else value = item[Object.keys(item)[0]];

                if (!isAllYn && value === 'ALL') return false;

                if (displayCol) {
                    label = '';
                    displayCol.forEach((col) => {
                        if (!label) label = item[col];
                        else {
                            if (label !== 'ALL') {
                                label += ' ' + item[col];
                            }
                        }
                    })

                }
                else label = item[Object.keys(item)[1]];

                if (defaultValue) {
                    //  if (id === 'create_user') log("reactselect defaultValue : ", defaultValue, value);
                    //  if (id === 'create_user') log("reactselect  defaultValue1 : ", value);
                    if (value === defaultValue) {
                        setFirstVal(value);
                        setFirstLab(label);

                        setSelectedVal({
                            label: label,
                            value: value,
                        });
                        setValue(id, value);
                    };
                } else {
                    if (isMandatory && i === 0) {
                        setFirstVal(value);
                        setFirstLab(label);
                        setSelectedVal({
                            label: label,
                            value: value,
                        });
                        setValue(id, value);
                    }
                }

                return { value: value, label: label };
            }).filter((x:any) => x)
        );

        // log("=============defaultValue", getValue);
    }, [dataSrc, defaultValue]);

    // useEffect(() => {
    //     //  log("useEffect reactselect2", firstLab, firstVal)
    //     if (firstLab && firstVal) {
    //         setSelectedVal({
    //             label: firstLab,
    //             value: firstVal,
    //         });
    //         setValue(id, firstVal);
    //     } else {
    //         setValue(id, null);
    //     }
    // }, [firstLab, firstVal]);

    useEffect(() => {
        if (delayEnter && isChangeFinish){
            moveNextComponent(target);
            setDelayEnter(false);
            setisChangeFinish(false);
        } 
    }, [delayEnter, isChangeFinish]);

    const moveNextComponent = (target: EventTarget | null) => {
        // log("moveNextComponent", target)
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
          const form = target.form;
          if (form) {
            // log('enter event1', target);
            const index = Array.from(form.elements).indexOf(target);
            // log('enter event', index);
            if (index > -1 && index + 1 < form.elements.length) {
              const nextElement = form.elements[index + 1] as HTMLElement;
              nextElement.focus();
            }
          }
        }
      };

    function handleKeyDown(e: any) {
        try {
                //const menu = ref.current.select.menuListRef;
                //const options = menu.querySelectorAll(".my-select__option");
                // console.log('enter', options)

                // options.forEach((option, index) => {
                //     console.log('enter?',options)
                //   new ClassWatcher(
                //     option,
                //     "my-select__option--is-focused",
                //     () => setFocusedValue(OPTIONS[index].value),
                //     () => {}
                //   );
                // });              

            log("handleKEyDonw", e.key, delayEnter)
            
            if (e.key === "Enter" /*&& !menuIsOpen*/) {
                if (delayEnter) {
                    moveNextComponent(e.target);
                } else {
                    setDelayEnter(true);
                    setTarget(e.target);
                }
            }

            if (events?.onKeyDown) {
                events.onKeyDown(e);
            }
        } catch (ex) {
            log("err", ex)
        }
    }

    const handleChange = (e: any) => {
        // log("=-=-=-handleChange", id, e.value)
        setValue(id, e.value);
        setSelectedVal({ id:id, value: e.value, label: e.label });
        let dispCol = displayCol?.length 
                    ? displayCol[displayCol?.length-1] : (dataSrc?.data ? Object.keys(dataSrc?.data[0])[1] : '') ;

        if (events?.onChange) {
            events.onChange(e,id,e.value);
        }

        setisChangeFinish(true);
        // moveNextComponent(target);
        
    }

    const handleMenuOpen = () => {
        log("open")
        setMenuIsOpen(true);
      };
    
    const handleMenuClose = () => {
        log("close")
        setMenuIsOpen(false);
    };

    function computeFontSize(heightStr: string) {
        const heightNum = parseInt(heightStr, 10); // 예: "20px" → 20
        const fontSizeNum = heightNum * 0.47; // 비율
        return `${fontSizeNum}px`;
      }

    const computedFontSize = computeFontSize(defHeight);

    const customStyles = {
        container: (base: any) => ({
            ...base,
            width: `${defWidth} !important`,
            // height: defHeight
        }),
        control: (base: any) => ({
            ...base,
            //   padding : "1px",
            width: `${defWidth} !important`,
            minHeight: defHeight,
            height: defHeight,
            display: "flex",
            alignItems: "center",
            padding: 0,
            // fontSize: 13,
            fontSize: computedFontSize,
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
            // height: "30px",
            height: defHeight,
            justifyContent: "flex-start",
            display: "flex",
            alignItems: "center",
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0
        }),
        input: (base:any) => ({
            ...base,
            margin: 0,
            padding: 0,
            height: defHeight,
            // lineHeight: defHeight,
          }),
        singleValue: (base:any) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            lineHeight: defHeight,
          }),
        indicatorSeparator: (base: any) => ({
            ...base,
            display: "none",
        }),
        clearIndicator: (base: any) => ({
            ...base,
            display: "none",
        }),
        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            // padding: `${(30 - 20 - 1 - 1) / 2}px`,
            padding: 0,
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none'
        }),
    };



    return (
        <>
            <InputWrapper outerClassName="" inline={inline} >
                {!noLabel && <Label id={id} name={label} lwidth={lwidth} isDisplay={isDisplay}/>}
                {dialog ?
                    <Controller
                        control={control}
                        name={id}
                        rules={rules}
                        render={({ field }) => {
                            return (
                                <div className={`${display} my-react-select-container flex-row ${defWidth} flex-grow-1`}>
                                    <ReactSelectComponent
                                        {...field}
                                        ref={ref}
                                        id={id}
                                        // classNamePrefix="my-react-select"
                                        value={selectedVal}
                                        isMulti={isMulti}
                                        options={list}
                                        instanceId={id}
                                        onChange={(e: any) => { handleChange(e); }}
                                        onKeyDown={(e:any) => { handleKeyDown(e);}}
                                        onMenuOpen={handleMenuOpen}
                                        onMenuClose={handleMenuClose}       
                                        menuPortalTarget={document.getElementsByClassName('dialog-base')[0] as HTMLElement}
                                        menuPosition='fixed'
                                        styles={customStyles}
                                        isDisabled={isReadOnly}
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
                        render={({ field }) => {
                            return (
                                <div className={`${display} my-react-select-container inline-block ${defWidth} flex-grow-1`}>
                                    <ReactSelectComponent
                                        // ref={ref}
                                        {...field}
                                        classNamePrefix="my-react-select"
                                        value={selectedVal}
                                        isMulti={isMulti}
                                        options={list}
                                        instanceId={id}
                                        onChange={(e: any) => { handleChange(e); }}
                                        onKeyDown={(e:any) => { handleKeyDown(e);}}
                                        styles={customStyles}
                                        isDisabled={isReadOnly}
                                    />
                                </div>
                            );
                        }}
                    />
                }
            </InputWrapper>
        </>
    );
});
