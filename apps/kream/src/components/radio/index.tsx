// import { InputWrapper } from "components/wrapper";
// import { Label } from "components/label";
// import { InputHTMLAttributes, ChangeEvent, memo } from "react";
// import { IoOptions } from "react-icons/io5";
// import "./style.css";

// // 라디오 버튼 옵션
// export interface RadioBtnOption {
//   label: string;
//   name: string;
//   value: string;
// }

// // RadioBtnGroup 컴포넌트의 props
// export interface RadioBtnGroupProps {
//   options: RadioBtnOption[];
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   value: string;
// }

// // Radio Btn 컴포넌트의 props - inputHTMLAttributes<HTMLInputElement>를 상속받아 표준 <input> 요소의 모든 속성을 사용할 수 있도록 함
// export interface RadioBtnProps extends InputHTMLAttributes<HTMLInputElement> {
//   label: string;
// //   radio: RadioProps;
// }

// const RadioBtn: React.FC<RadioBtnProps> = ({
//   label,
//   id,
//   value,
// }: RadioBtnProps) => {
//   return (
//     <>
//       <div className="flex items-center w-full ">
//         <input type="radio" className="radio-input" id={id} value={value} />
//         <label className="font-normal text-[12px] leading-6 flex items-center text-gray-500 cursor-pointer" htmlFor={id}>
//           <span className="flex p-1 m-1">{label}</span>
//         </label>
//       </div>
//     </>
//   );
// };

// export default RadioBtn;

import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import RadioContext from "./RadioGroup";
import { useFormContext } from "react-hook-form";

const { log } = require("@repo/kwe-lib/components/logHelper");

export type RadioProps = {
  id: string;
  title?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  value?: string;
  defaultChecked?: boolean;
  name?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Radio: React.FC<RadioProps> = ({
  id,
  children,
  value,
  name,
  label = "",
  defaultChecked,
  disabled,
  onChange,
}) => {
  const { t } = useTranslation();
  const { register, getValues, setValue } = useFormContext();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // log("Radio onChange", e.target.id,e.target.value)
    const value = parseInt(e.target.value, 10);
    setValue(e.target.id, value.toString());

    if (onChange) {
      onChange(e);  
    }
  }

  return (
    <label className="flex items-center w-full text-gray-500">
      <input
        // {...register(id)}
        className="items-center p-1 text-gray-500"
        type="radio"
        id={id}
        value={value}
        name={name?name:id}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      {t(label)}
    </label>
  );
};

export default Radio;
