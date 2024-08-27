import { ChangeEventHandler } from "react";
import { InputWrapper } from "components/wrapper";
import { useTranslation } from "react-i18next";
// import { createContext } from "react";
import React from "react";

type Props = {
  id?:string;
  label?: string;
  inline?: boolean;
  value?: any;
  children: React.ReactNode;
//   onChange : ChangeEventHandler<HTMLInputElement>,
};
// const RadioContext = createContext({});
const RadioGroup: React.FC<Props> = ({
  id,
  label,
  children,
  inline = false,
//    onChange,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <InputWrapper outerClassName="" inline={inline}>
      <fieldset className="flex items-center content-around w-full p-1 m-1 space-x-1">
        <legend className="flex w-full text-gray-500">{t(label || '')}</legend>
        {/* <RadioContext.Provider value={rest} >{children}</RadioContext.Provider> */}
        {children}
      </fieldset>
    </InputWrapper>
  );
};

export default RadioGroup;
