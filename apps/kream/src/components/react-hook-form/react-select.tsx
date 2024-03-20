import {Controller, useFormContext} from "react-hook-form";
import {default as ReactSelectComponent} from "react-select";

export interface ReactSelectOptionProps {
  label: string;
  value: string;
}

export type ReactSelectProps = {
  id: string;
  name: string;
  options: ReactSelectOptionProps[];
  rules?: Record<string, any>;
  placeholder?: string;
  isMulti?: boolean;
};

export const ReactSelect: React.FC<ReactSelectProps> = ({
  id,
  name,
  placeholder,
  options,
  rules = {},
  isMulti = false,
}) => {
  const {control} = useFormContext();

  return (
    <Controller
    control={control}
      name={name}
      rules={rules}
      render={({field:{onChange}}) => {
        return (
          <div className="block w-full flex-grow-1">
            <ReactSelectComponent
              //{...field}
              isMulti={isMulti}
              placeholder={placeholder}
              options={options}
              instanceId={id}              
              onChange={(target:any)=>{
                onChange(target.value)
              }}                         
            />
          </div>
        );
      }}
    />
  );
};
