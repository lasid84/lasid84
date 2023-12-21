import { useFormContext } from "react-hook-form";
export type TextareaProps = {
  id: string;
  name: string;
  rules?: Record<string, any>;
  rows?: number;
  placeholder?: string;
  width?: string;
  height?: string;
  readOnly?: boolean;
  notAppliedReadOnlyCss?: boolean;
};

export const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  rules = {},
  rows = 3,
  placeholder = "",
  width = "w-full",
  height = "",
  readOnly = false,
  notAppliedReadOnlyCss = false,
}) => {
  const { register } = useFormContext();
  let readOnlyCss;
  if (readOnly && !notAppliedReadOnlyCss) {
    readOnlyCss = "read-only:bg-gray-100";
  }
  return (
    <textarea
      {...register(name, rules)}
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={`${rows > 1 ? "" : "h-8"} block ${width} ${height} ${readOnlyCss} border-gray-300 bg-white form-textarea focus:ring-blue-500 focus:border-blue-500 focus:ring-0 text-[13px] rounded-md resize-none`}
      readOnly={readOnly}
    />
  );
};
