import React from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
  
  interface RadioOption {
    value: string;
    label: string;
  }
  
  interface RadioGroupFieldProps {
    id: string;
    name?: string | null;
    label?: string;
    noLabel?: boolean
    isRow?:boolean
    dataSrc: RadioOption[];
    onClick?: (e: any) => void;
    onChange?: (e: any) => void;
  }

  const RadioGroupField: React.FC<RadioGroupFieldProps> = ({ 
    id, 
    name, 
    label,
    noLabel = false,
    isRow = true,
    dataSrc,
    onClick,
    onChange
}) => {
    const { control } = useFormContext();
    const { t } = useTranslation();

    const handleClick = (e:any) => {
      if (onClick) onClick(e);
    }
  
    function handleChange(e: RadioOption) {
      if (onChange) onChange(e);
    }

    return (
      <FormControl component="fieldset">
        {!noLabel && <FormLabel component="legend" className="justify-center block text-xs font-medium text-gray-500/75 dark:text-gray-200 whitespace-nowrap">{t(label?label:id)}</FormLabel>}
        <Controller
          name={name ? name : id}
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row={isRow}>
              {dataSrc.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio  size="small" />}
                  // label={option.label}
                  label={<span className="text-sm">{t(option.label)}</span>}
                  className="mr-4"
                  onClick={() => {
                    handleClick(option);
                  }}
                  onChange={() => {
                    handleChange(option)
                  }}
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  };


  export default RadioGroupField;