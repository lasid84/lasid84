import { useFormContext } from "react-hook-form";

export type CheckboxProps = {
  id: string;
  name: string;
  label: string;
  rules?: Record<string, any>;
  onClick?: any;
  readOnly?: boolean;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  name,
  rules = {},
  onClick,
  readOnly = false,
}) => {
  const { register } = useFormContext();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center h-6">
        <input
          {...register(name, rules)}
          id={id}
          name={name}
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500"
          onClick={(e: any) => {
            if (readOnly) e.preventDefault();
          }}
        />
      </div>
      <div className="text-sm space-y-1">
        <div className="shrink-0 block font-medium text-gray-700  whitespace-nowrap">{label}</div>
      </div>
    </div>
  );
};
