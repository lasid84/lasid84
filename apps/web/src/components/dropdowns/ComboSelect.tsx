import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IgrMultiColumnComboBoxModule } from 'igniteui-react-grids';
import { IgrMultiColumnComboBox, SortMode } from 'igniteui-react-grids';

IgrMultiColumnComboBoxModule.register();

export function MultiColumnComboBoxOverview(props:any) : JSX.Element {
  const {setValue } = useFormContext();
  const onchange = (s:any , e:any) => {
    setValue('cust_code', s.value)
    if(s.value==null){
      setValue('cust_code', '')
    }
  }


    return (      
      <div className="App w-full space-y-1">        
        <IgrMultiColumnComboBox
          {...props.register}
          defaultColumnWidth="180" 
          label={props.label}
          dataSource={props.data}
          fields={props.column}
          textField={props.textfiled}
          placeholder=''
          selectedValueChanged={onchange}           
          >
          </IgrMultiColumnComboBox>

      </div>
    );
  }