import { Controller, useFormContext } from "react-hook-form";
import { default as ReactSelectComponent } from "react-select";

export interface ReactSelectOptionProps {
  label: string;
  value: string;
}

export type ReactSelectProps = {
  id: string;
  name: string;
  options: ReactSelectOptionProps[];
  value?: any;
  width?: string;
  height?: string;
  rules?: Record<string, any>;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isMulti?: boolean;
};

export const ReactSelect: React.FC<ReactSelectProps> = ({
  id,
  name,
  options,
  value,
  rules = {},
  width = "w-full",
  height = "h-8",
  placeholder = "Select",
  isMulti = false,
  onChange,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <div className={`block  ${width} ${height}  flex-grow-1`}>
            <ReactSelectComponent
              {...field}
              defaultInputValue={value}
              isMulti={isMulti}
              placeholder={placeholder}
              options={options}
              instanceId={id}
              onChange={onChange}
            />
          </div>
        );
      }}
    />
  );
};
