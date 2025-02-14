import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';
import { KeyboardEventHandler, SyntheticEvent, forwardRef, memo, useEffect, useState } from 'react';
import { InputWrapper } from 'components/wrapper';
import { Label } from 'components/label';
import clsx from 'clsx';
import MaskedInput, { Mask, MaskedInputProps, conformToMask} from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import './index.css';
import { Button } from '@/components/button';

import { log, error, stringToDate, stringToDateString, DateToString } from '@repo/kwe-lib-new';


type Props = {
  id:string;
  label?:string;
  value?:string;
  width?:string;
  lwidth?:string;
  height?:string;
  options?: {
    dateFormat?:string;
    inline?: boolean;         //라벨명 위치
    myPlaceholder?: string;   //

    /* Tailwind Style */
    bgColor?: string;         //Background Color (ingerit, current, transparent, black, white, slate-50......)
    fontSize?: string;        //Font Size (xs, sm, base, lg, xl, 2xl......)
    fontWeight?: string;      //Font Weight (thin, extralight, ligth, normal, medium, semibold, bold ......)
    textAlign?: string;       //Text Align (left, center, right)
    radius?: string;          //Border Radius (none, sm, '', md, lg, xl, 2xl, full, ......)
    freeStyles?:string;       //freestyle

    isReadOnly?:boolean;      //읽기전용여부
    rules?: Record<string, any>;
    noLabel?:boolean;
    isDisplay? : boolean;     //사용자 권한에 따른 display 여부
    isShowButton?: boolean;   //날짜조정 버튼
  };

  events?: {
    onChange? : (event: React.SyntheticEvent<any> | undefined, id: string, date: Date | null) => void;
    onKeyDown? : (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onFocus? : (event: React.FocusEvent<HTMLDivElement>) => void;
  }
};

// const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy HH:MM')
const autoCorrectedDatePipe = createAutoCorrectedDatePipe('yyyy-MM-dd');

export const DatePicker: React.FC<Props> = memo((props:Props) => {
    // registerLocale("ko", ko);
    const { control, setValue } = useFormContext();
    const { id, label, value, width, height, lwidth, options = {}, events } = props;
    const { dateFormat = 'yyyy-MM-dd', myPlaceholder, inline = false, noLabel = false,
            isReadOnly = false,
            textAlign = "left", bgColor, fontSize = "13px", fontWeight = "normal",
            freeStyles = '', radius = 'none', isDisplay=true,
            isShowButton = false
    } = options;
    let { rules } = options;

    // const [selectedVal, setSelectedVal] = useState<Date | null>(new Date());
    const [selectedVal, setSelectedVal] = useState<Date | null>();

    const defWidth = width ? width : "w-full";
    const defHeight = height ? height : "h-8";
    rules = {
        // minDate:'',
        maxDate:stringToDateString('9999-12-31'),
        ...rules,

    }

    useEffect(() => {
        if (selectedVal || selectedVal === null) {
            setValue(id, DateToString(selectedVal));
        }
    }, [selectedVal]);

    useEffect(() => {
        if (value || value === null) {
            var date = stringToDate(value);
            // log('value rendering,,,,', date, DateToString(date))
            setSelectedVal(date);
            setValue(id, DateToString(date));
        }
    }, [value]);

    function handleKeyDown(e:any){
        try {
            if (e.key === "Enter") {
                // e.preventDefault();
                // const form = e.target.form;
                // let index = [...form].indexOf(e.target);
                
                // //필드셋과 버튼은 포커스 제외 - stephen
                // while ((form[index + 1] instanceof HTMLButtonElement) || (form[index + 1] instanceof HTMLFieldSetElement)) index++;

                // log("handleKeyDown", e.target, index, form[index + 1], form);
                // form[index + 1].focus();
                
                e.preventDefault();  // 기본 엔터 동작을 막음
                const form = e.target.form.elements;
                var index = Array.prototype.indexOf.call(form, e.target);

                //필드셋과 버튼은 포커스 제외 - stephen
                while ((form[index + 1] instanceof HTMLButtonElement) 
                || (form[index + 1] instanceof HTMLFieldSetElement) 
                || (form[index + 1].readOnly === true)
                ) index++;

                // 다음 요소가 input일 경우 포커스 이동
                if (form[index + 1]) {
                    form[index + 1].focus();
                }
            }
        
            if (events?.onKeyDown) {
                events.onKeyDown(e);
            }
        } catch (ex) {
            log(ex)
        }
      }

      function handleFocus(e:React.FocusEvent<HTMLInputElement>) {
        //log("handelFocus", e, document.querySelector('.react-datepicker__input'));
        // (document.querySelector('.react-datepicker__input') as HTMLInputElement).select();
        e.target.select();

        if (events?.onFocus) {
            events.onFocus(e);
        }
      }
    
    function handelChange(date: Date | null, e: any): void {
        // log("handelChange", e?.target, date);

        // if (date) { 
            setSelectedVal(date);
            setValue(id, DateToString(date));
        // } 

        if (events?.onChange) {
            events.onChange(e, id, date);
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        log(e.target)
    }

    const handleCalendarClose = () => {
        //log("Calendar closed");
    };
    const handleCalendarOpen = () => {
        //log("Calendar opened");
    };

    const handleDayChange = (days: number) => {
        if (selectedVal) {
          const newDate = new Date(selectedVal);
          newDate.setDate(newDate.getDate() + days);
          setSelectedVal(newDate);
          if (events?.onChange) {
            events.onChange(undefined, id, newDate);
          }
        }
      };

    return (
        <InputWrapper outerClassName="" inline={inline}>
            {!noLabel && <Label id={id} name={label} lwidth={lwidth} isDisplay={isDisplay}/>}
            {/* <div className={clsx(`block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}> */}
            <div className="flex items-center gap-1 min-w-100">
                <Controller
                    control={control}
                    name={id}
                    rules={rules}
                    render={({ field }) => (
                        <ReactDatePicker
                            id={id}
                            className={clsx(`form-input block ${defWidth} ${defHeight} disabled:bg-gray-300 ${bgColor} flex-grow-1 min-w-[100px]
                                    focus:border-blue-500 focus:ring-0 text-[${fontSize}] font-${fontWeight} rounded-${radius} read-only:bg-gray-200 text-${textAlign}
                                    dark:bg-gray-900 dark:text-white dark:border-gray-700
                                    ${freeStyles}
                                    `)}
                            customInput= {
                                <MaskedInput
                                    pipe={autoCorrectedDatePipe}
                                    mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                                    keepCharPositions= {true}/>
                                }
                            autoComplete='off'
                            dateFormat={dateFormat}
                            selected={selectedVal}
                            // locale={ko}
                            readOnly={isReadOnly}
                            shouldCloseOnSelect
                            showIcon
                            preventOpenOnFocus
                            // icon={IoCalendarNumberOutline}
                            // showWeekNumbers
                            showPopperArrow={false}
                            isClearable = {false}
                            toggleCalendarOnIconClick
                            // showYearDropdown={true}
                            // {...rules}
                            maxDate={new Date('9999-12-31')}
                            onFocus={handleFocus}
                            onChange={handelChange}
                            onBlur={handleBlur}
                            onCalendarClose={handleCalendarClose}
                            onCalendarOpen={handleCalendarOpen}
                            onKeyDown={handleKeyDown}
                            // onInputClick={log("oninputclick")}
                            // dayClassName={(date) =>
                            //     // log("===========dayClassName date", date.getMonth(), selectedVal?.getMonth())
                            //     date.getMonth() !== selectedVal?.getMonth() ? "red" : null
                            // }
                        >
                             {/* <div style={{ color: "red" }}>Don't forget to check the weather!</div> */}
                            </ReactDatePicker>
                    )}
                />
                {isShowButton &&
                <>
                    <Button
                        id='btnLeft'
                        label='minus'
                        isLabel={false}
                        onClick={() => handleDayChange(-1)}
                    />
                    <Button
                        id='btnRight'
                        label='plus'
                        isLabel={false}
                        onClick={() => handleDayChange(1)}
                    />
                </>
                }
            </div>
        </InputWrapper>
    )
});