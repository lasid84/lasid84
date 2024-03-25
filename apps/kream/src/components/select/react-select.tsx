import React, { useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { default as ReactSelectComponent } from "react-select";
// import { Label, InputWrapper } from "components/react-hook-form"
import { InputWrapper } from "components/wrapper"
import { Label } from "components/label"


export interface ReactSelectOptionProps {
    label: string;
    value: string;
}

export type ReactSelectProps = {
    id: string;
    name?: string;
    options: ReactSelectOptionProps[];
    defaultValue?: {}
    rules?: Record<string, any>;
    placeholder?: string;
    isMulti?: boolean;
    inline?: boolean;
};

export const ReactSelect: React.FC<ReactSelectProps> = ({
    id,
    name,
    placeholder,
    options,
    defaultValue,
    rules = {},
    isMulti = false,
    inline,
}) => {
    const { control } = useFormContext();
    return (
        <>
            <InputWrapper outerClassName="" inline={inline}>
                <Label id={id} {...(name && { name: name })} />
                <Controller
                    control={control}
                    name={id}
                    rules={rules}
                    render={({ field: { onChange } }) => {
                        return (
                            <div className="block w-full flex-grow-1">
                                <ReactSelectComponent
                                    //{...field}
                                    defaultValue={defaultValue}
                                    isMulti={isMulti}
                                    options={options}
                                    instanceId={id}
                                    onChange={(e: any) => { onChange(e.value) }}
                                />
                            </div>
                        );
                    }}
                />
            </InputWrapper>
        </>
    );
};
