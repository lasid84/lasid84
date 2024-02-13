import { InputWrapper, LabelTop, Textarea } from "components/react-hook-form";

type TextareaProps = {
  id: string;
  label: string;
  width?: string;
  rows?: number;
  children?: any;
  readOnly?: boolean;
  height?: any;
};

export const TTextarea: React.FC<TextareaProps> = ({
  id,
  label,
  width = "w-full",
  rows = 4,
  children,
  readOnly = false,
  height,
}) => {
  return (
    <InputWrapper outerClassName="w-full" inline={false}>
      <LabelTop>{label}</LabelTop>
      <Textarea id={id} name={id} width={width} rows={rows} height={height} readOnly={readOnly} />
      {children}
    </InputWrapper>
  );
};
