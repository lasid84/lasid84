'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, RefObject } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useCommonStore } from "../_store/store";
import CustomSelect from "@/components/select/customSelect";
import { rowAdd } from "@/components/grid/ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import { log, error } from '@repo/kwe-lib-new';

import * as RTFJS from 'rtf.js';

type Props = {
    mGridRef: RefObject<AgGridReact>;
    focusRef: RefObject<any>;
};

const SearchForm: React.FC<Props> = ({mGridRef, focusRef}) => {
  const { getValues, setValue, handleSubmit, reset } = useFormContext();
    
  const loadDatas = useCommonStore((state) => state.loadDatas);
  const selectedCustData = useCommonStore((state) => state.selectedCustData);
  const custDetailData = useCommonStore((state) => state.custDetailData);
  
  const { setState, resetSearchParam,  getLoad, setFTFToHtml } = useCommonStore((state) => state.actions);

  const onSave = () => {
    const params = getValues();
    
    (loadDatas?.[7]?.data as []).forEach(row => {
      RTFViewer(row);
    })
  }

  const RTFViewer= async (row: {cust_code:string, cust_mode:string, etc:string}) => {  
      const { Document } = RTFJS.RTFJS;
      // RTF 문자열을 ArrayBuffer로 변환
      const encoder = new TextEncoder();
      const buffer = encoder.encode(row.etc).buffer as ArrayBuffer;

      // settings 인자는 ISettings 타입으로, 기본값이 없는 경우 빈 객체를 전달할 수 있음.
      const settings = {}; // 필요한 설정이 있다면 여기에 추가하세요.

      const doc = new Document(buffer, settings);
      doc.render().then((nodes) => {
        const htmlString = nodes.map(node => node.outerHTML).join('');
        const param = {
          cust_code: row.cust_code,
          cust_mode: row.cust_mode,
          etc: htmlString.replace(/<div\s+style="min-height:\s*9pt;\s*text-align:\s*left;">\s*<\/div>/g, '<p><br></p>')
        }
        setFTFToHtml(param);
        log('finish RTFViewer', param);
      });
      

    // return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }
  
  return (
      <form>
        <PageSearchButton
          right={
            <>
              {/* <div className={"col-span-1"}>
                <Button id="btnSearch" label="search" onClick={onSearch} />
              </div> */}
              <div className={"col-span-1"}>
                <Button id="btnSave" label="save"
                  disabled={!selectedCustData?.cust_code}
                  onClick={onSave} 
                  />
              </div>
            </>
          }
        >
          
          <div className={"col-span-2"}>
            <CustomSelect
                id="search_cust_code"
                initText="Select an option"
                listItem={loadDatas?.[0]}
                valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
                displayCol="cust_nm"
                gridOption={{
                  colVisible: {
                    col: ["cust_code", "cust_nm", "bz_reg_no"],
                    visible: true,
                  },
                }}
                gridStyle={{ width: "600px", height: "300px" }}
                style={{ width: "1000px", height: "8px" }}
                isDisplay={true}
                inline={true}
                events={{
                  onSelectionChanged(e, id, value) {
                      // log("onSelectionChanged", e, id, value, );
                      const selectedRow = e.api.getSelectedRows()[0];
                      setValue(id, value);
                      setState({selectedCustData:selectedRow})
                  },
                }}
              />
          </div>
        </PageSearchButton>
        </form>
    );
};

export default memo(SearchForm);