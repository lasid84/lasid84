
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

import { log, error } from '@repo/kwe-lib-new';

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
