'use client'
import { useEffect, useState } from "react";
import { MaskedInputField, Input, TextArea } from 'components/input';
import CustCont from "@/components/commonForm/customerContact";
import { ReactSelect, data } from "components/select/react-select2";
import { PageGrid } from "@/layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import ResizableLayout from "./Layout/ResizableLayout";
import { Button } from "@/components/button";
import { useCommonStore } from "../../_store/store";
import { gridData, rowAdd } from "@/components/grid/ag-grid-enterprise";
import EditorQuill from "@/components/editor/reactQuill";

import GridCustCont from "components/commonForm/customerContact/_component/gridMaster";

import { log } from '@repo/kwe-lib-new';

type Props = {

};

const MainPage: React.FC<Props> = () => {

    const loadDatas = useCommonStore((state) => state.loadDatas) || '';
    /** “숨기기/펼치기” 상태 */
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const selectedCustData = useCommonStore((state) => state.selectedCustData);

    const custDetailData = useCommonStore((state) => state.custDetailData);
    const {searchParams, cust_mode = ''} = useCommonStore((state) => state);
    const actions = useCommonStore((state) => state.actions);
    const { refCustCont, refAgencyCont } = useCommonStore((state) => state.gridRef);

    useEffect(() => {
        //ResizableLayout 이 렌더링 되어야 중간 넓이가 계산 되므로 아래처럼 처리
        setTimeout(() => {
            setIsCollapsed(true);
        }, 500)
    }, []);

    // “접기/펼치기” 버튼
    const handleToggle = () => {
        setIsCollapsed((prev) => {
        return !prev;
        });
    };

    return (
        <div className="h-full m-2">
            {/* 고객담당자, 대행사정보 */}
            {/* <div className={`h-[200px] border ${isCollapsed ? 'hidden' : ''}`}> */}
            <div className={`border ${isCollapsed ? 'hidden' : ''}`}>
                <ResizableLayout 
                    leftContent={
                        <div className="flex flex-col w-full h-full">
                            <div className="flex items-center justify-between w-full h-auto">
                                <LabelGrid id={'고객정보'} textColor="blue-700" />
                                <Button id={"btnAdd"} label="add" height="h-5"
                                    onClick={() => {
                                        // log("onClick refCustCont", refCustCont)
                                        rowAdd(refCustCont?.current, { "use_yn": true, "def": false, cont_type: cust_mode})
                                    }}
                                />
                            </div>
                            <div className="flex-1 h-full overflow-auto">
                                <GridCustCont ref={refCustCont} id="custCont" initData={[]} params={{ cust_code: selectedCustData?.cust_code, cont_type: cust_mode}} />
                            </div>
                        </div>
                    } 
                    rightContent={
                        <div className="flex flex-col w-full h-full">
                            <div className="flex items-center justify-between w-full h-auto">
                                <LabelGrid id={'대행사정보'} textColor="blue-700" />
                                <Button id={"btnAdd"} label="add" height="h-5"
                                    onClick={() => {
                                        // log("onClick refCustCont", refCustCont)
                                        rowAdd(refAgencyCont?.current, { "use_yn": true, "def": false, cont_type: cust_mode})
                                    }}
                                />
                            </div>
                            <div className="flex-1 h-full overflow-auto">
                                <GridCustCont ref={refAgencyCont} id="agencyCont" initData={[]} params={{ cust_code: selectedCustData?.cust_code, cont_type: cust_mode}} isAgency={true} />
                            </div>
                        </div>
                    } 
                />
            </div>
            {/* 하단의 숨기기/펼치기 버튼 */}
            <div className="w-full block mb-1 border-t border-gray-200 h-[18px] items-center justify-center">            
                <Button
                    id='btnCustContHidden'
                    label={isCollapsed ? '고객사,대행사 정보 ↓':'고객사,대행사 정보 ↑'}
                    color="gray-outline"
                    height="h-4"
                    options={{
                    }}
                    onClick={handleToggle}
                />                
            </div>
            <div className="grid md:grid-cols-5">
                <ReactSelect
                    id="bldlv" dataSrc={loadDatas[1] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd', 'cd_nm'],
                        defaultValue: custDetailData?.bldlv,
                        isAllYn: false,
                        inline:true,
                        isReadOnly: !selectedCustData?.cust_code
                    }}/>   
                <MaskedInputField
                    id="blremark"
                    height="h-8"
                    value={custDetailData?.blremark}
                    options={{
                        inline:true,
                        isReadOnly: !selectedCustData?.cust_code,
                    }}
                    events={{
                        // onChange: onChangedData
                    }}
                />        
                <ReactSelect
                    id="delivery_release_doc" dataSrc={loadDatas[2] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd_nm'],
                        defaultValue: custDetailData?.delivery_release_doc,
                        isAllYn: false,
                        inline:true,
                        isReadOnly: !selectedCustData?.cust_code
                    }}/> 
                <ReactSelect
                    id="cs_person" dataSrc={loadDatas[3] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd_nm'],
                        defaultValue: custDetailData?.cs_person,
                        isAllYn: false,
                        inline:true,
                        isReadOnly: !selectedCustData?.cust_code
                    }}/> 
                <ReactSelect
                    id="sales_person" dataSrc={loadDatas[4] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd_nm'],
                        defaultValue: custDetailData?.sales_person,
                        isAllYn: false,
                        inline:true,
                        isReadOnly: !selectedCustData?.cust_code
                    }}/> 
            </div>
            {/* 계약관련 - 현업확인 후 삭제 예정 */}
            {/* <div className="col-span-5 mt-2">
                <PageGrid
                    title={
                        <><LabelGrid id={'계약관련'} textColor="blue-700" /></>}
                    right={ <> </>}>
                    <div className="grid flex-col w-full grid-cols-3 gap-1">
                    <ReactSelect
                        id="BILLING TYPE - X" dataSrc={{}}
                        height="h-6"
                        options={{
                            keyCol: "transport_type",
                            displayCol: ['transport_type_nm'],
                            defaultValue: '',
                            isAllYn: false,
                            inline:true,
                            isReadOnly: !selectedCustData?.cust_code
                        }}/> 

                    <ReactSelect
                        id="B/L H/C - X" dataSrc={{}}
                        height="h-6"
                        options={{
                            keyCol: "transport_type",
                            displayCol: ['transport_type_nm'],
                            defaultValue: '',
                            isAllYn: false,
                            inline:true,
                            isReadOnly: !selectedCustData?.cust_code
                        }}/> 

                    <ReactSelect
                        id="CCFEE  - X" dataSrc={{}}
                        height="h-6"
                        options={{
                            keyCol: "transport_type",
                            displayCol: ['transport_type_nm'],
                            defaultValue: '',
                            isAllYn: false,
                            inline:true,
                            isReadOnly: !selectedCustData?.cust_code
                        }}/> 
                </div>
                </PageGrid>
            </div> */}
            {/* 고객요청, 기타 */}
            <div className="grid items-stretch w-full grid-cols-2 gap-1">
                <div className="grid flex-row w-full grid-cols-2 gap-1 ">
                    <LabelGrid id={'고객요청'} textColor="blue-700" />
                    <div className="col-span-2">
                        <TextArea id={"depl_req"} rows={5} cols={0}
                            value={custDetailData?.depl_req}
                            options={{
                                inline: true,
                                isReadOnly: !selectedCustData?.cust_code,
                                freeStyles: 'text-red-500'
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="cer_apply"
                            height="h-8"
                            value={custDetailData?.cer_apply}
                            options={{
                                inline:true,
                                isReadOnly: !selectedCustData?.cust_code
                            }}
                            events={{
                                // onChange: onChangedData
                            }}
                        />     
                    </div>
                    <div className="col-span-2">
                        <TextArea id={"op_detail"} rows={3} cols={0}
                            value={custDetailData?.op_detail}
                            options={{
                                inline: true,
                                isReadOnly: !selectedCustData?.cust_code
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <TextArea id={"wh_etc"} rows={3} cols={0}
                            value={custDetailData?.wh_etc}
                            options={{
                                inline: true,
                                isReadOnly: !selectedCustData?.cust_code
                            }}
                        />
                    </div>
                </div>
                
                <div className="ml-5">
                        <LabelGrid id={'etc'} textColor="blue-700" />
                        <EditorQuill id='etc' height="h-full" value={custDetailData?.etc}
                            onContentChange={(content) => {
                                // if (custDetailData) custDetailData['etc'] = content;
                                // log("EditorQuill", content)
                            }}
                        />
                </div>
            </div>
        </div>
    );
}

export default MainPage;