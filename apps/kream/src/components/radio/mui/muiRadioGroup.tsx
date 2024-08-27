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
    dataSrc: RadioOption[];
  }

  const RadioGroupField: React.FC<RadioGroupFieldProps> = ({ 
    id, 
    name, 
    label, 
    dataSrc 
}) => {
    const { control } = useFormContext();
    const { t } = useTranslation();
  
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">{t(label?label:id)}</FormLabel>
        <Controller
          name={name ? name : id}
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              {dataSrc.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  };


  export default RadioGroupField;