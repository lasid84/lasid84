import { Textarea } from "components/react-hook-form/textarea";
import { HTMLInputTypeAttribute } from "react";

export type TextareaProps = {
    id: string;
    label: string;
    width?: string;
    children?: any;
    readOnly?: boolean;
    isAdd?: boolean;
    notAppliedReadOnlyCss?: boolean;
    type?: HTMLInputTypeAttribute;
    value?: any;
    rules?: any;
};

export const TTextarea2: React.FC<TextareaProps> = ({
    id,
    label,
    width = "w-full",
    children,
    readOnly = false,
    isAdd = false,
    notAppliedReadOnlyCss = false,
    type = "text",
    value,
    rules = {},
}) => {
    return (
        <div className="flex flex-row items-start mx-1 ">
            <label
                htmlFor={id}
                className={`w-full md:text-right mx-1 py-2`}>
                {label}
            </label>
            <Textarea
                id={id}
                name={id}
            />
        </div>
    );
};


