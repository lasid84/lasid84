import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; //한국어 설정
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, forwardRef, useEffect, useState } from 'react';
import { InputWrapper } from 'components/wrapper';
import { Label } from 'components/label';
import clsx from 'clsx';
import { IoCalendarNumberOutline } from "react-icons/io5";
import MaskedInput, { Mask, MaskedInputProps, conformToMask} from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import './index.css';


const { stringToDate, stringToDateString, DateToString } = require('@repo/kwe-lib/components/dataFormatter');
const { log } = require('@repo/kwe-lib/components/logHelper');


type Props = {
  id:string;
  label?:string;
  value?:string;
  width?:string;
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
  };

  events?: {
    onChange? : (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void;
    onKeyDown? : (event: React.KeyboardEvent<HTMLDivElement>) => void;
  }
};

// const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy HH:MM')
const autoCorrectedDatePipe = createAutoCorrectedDatePipe('yyyy-MM-dd');

export const DatePicker: React.FC<Props> = (props:Props) => {
    // registerLocale("ko", ko);
    const { control, setValue } = useFormContext();
    const { id, label, value, width, height,  options = {}, events } = props;
    const { dateFormat = 'yyyy-MM-dd', myPlaceholder, inline = false, noLabel = false,
            isReadOnly = false,
            textAlign = "left", bgColor, fontSize = "13px", fontWeight = "normal",
            freeStyles = '', radius = 'none'
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
        if (selectedVal) {
            setValue(id, DateToString(selectedVal));
        }
    }, [selectedVal]);

    useEffect(() => {
        if (value) {
            var date = stringToDate(value);
            log('value rendering,,,,', date, DateToString(date))
            setSelectedVal(date);
            setValue(id, DateToString(date));
        }
    }, [value]);

    function handleKeyDown(e:any){
        try {
            if (e.key === "Enter") {
                const form = e.target.form;
                const index = [...form].indexOf(e.target);
                log("handleKeyDown", e.target, index, form);
                form[index + 1].focus();
                e.preventDefault();
            }
        
            if (events?.onKeyDown) {
                events.onKeyDown(e);
            }
        } catch (ex) {
    
        }
      }
    
    function handelChange(date: Date | null, e: any): void {
        log("handelChange", e?.target, date);

        // if (date) { 
            setSelectedVal(date);
            setValue(id, DateToString(date));
        // } 

        if (events?.onChange) {
            events.onChange(date, e);
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        log(e.target)
    }

    const handleCalendarClose = () => log("Calendar closed");
    const handleCalendarOpen = () => log("Calendar opened");

    return (
        <InputWrapper outerClassName="" inline={inline}>
            {!noLabel && <Label id={id} name={label}  />}
            {/* <div className={clsx(`block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}> */}
                <Controller
                    control={control}
                    name={id}
                    rules={rules}
                    render={({ field }) => (
                        <ReactDatePicker
                            // className={clsx(`${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}
                            // className={clsx(`form-input block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}
                            className={clsx(`form-input block ${defWidth} ${defHeight} disabled:bg-gray-300 ${bgColor} flex-grow-1
                                    focus:border-blue-500 focus:ring-0 text-[${fontSize}] font-${fontWeight} rounded-${radius} read-only:bg-gray-100 text-${textAlign}
                                    ${freeStyles}
                                    `)}
                            customInput= {
                                <MaskedInput
                                    pipe={autoCorrectedDatePipe}
                                    mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                                    keepCharPositions= {true}/>
                                }
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
            {/* </div> */}
        </InputWrapper>
    )
};