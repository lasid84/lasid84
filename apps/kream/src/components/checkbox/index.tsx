import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type CheckboxProps = {
  id: string;
  name?: string;
  label?: string;
  rules?: Record<string, any>;
  onClick?: any;
  readOnly?: boolean;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  rules = {},
  onClick,
  readOnly = false,
}) => {
  const { register, getValues, setValue } = useFormContext();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center h-6">
        <input
          {...register(id, rules)}
          id={id}
          name={name?name:id}
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500"
          onClick={(e: any) => {
            if (readOnly) e.preventDefault();
            setValue(id, e.target.checked);
            let val = getValues();
            onClick(val);
          }}
        />
      </div>
      <div className="space-y-1 text-sm">
        <div className="block font-medium text-gray-700 shrink-0 whitespace-nowrap">{t(label?label:id)}</div>
      </div>
    </div>
  );
};
