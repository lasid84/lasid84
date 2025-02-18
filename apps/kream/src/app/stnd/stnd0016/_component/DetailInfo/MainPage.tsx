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
import { gridData } from "@/components/grid/ag-grid-enterprise";
import EditorQuill from "@/components/editor/reactQuill";

import { log } from '@repo/kwe-lib-new';

type Props = {

};

const MainPage: React.FC<Props> = () => {

    const loadDatas = useCommonStore((state) => state.loadDatas) || '';
    /** “숨기기/펼치기” 상태 */
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const selectedCustData = useCommonStore((state) => state.selectedCustData);
    const custDetailData = useCommonStore((state) => state.custDetailData);
    const searchParams = useCommonStore((state) => state.searchParams);
    const actions = useCommonStore((state) => state.actions);

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
        <div className="m-2">
            {/* 고객담당자, 대행사정보 */}
            <div className={`h-[200px] border ${isCollapsed ? 'hidden' : ''}`}>
                <ResizableLayout 
                    leftContent={<CustCont initData={[]} params={{ cust_code: selectedCustData?.cust_code, cont_type: searchParams?.trans_mode + searchParams?.trans_type}} title="고객정보" titleColor="blue-700" />} 
                    rightContent={<CustCont initData={[]} params={{ cust_code: selectedCustData?.cust_code, cont_type: searchParams?.trans_mode + searchParams?.trans_type}} title="대행사정보" titleColor="blue-700" />}                            
                />
            </div>
            {/* 하단의 숨기기/펼치기 버튼 */}
            <div className="w-full block mb-1 border-t border-gray-200 h-[18px] items-center justify-center">
                <Button
                    id='btnCustContHidden'
                    label={isCollapsed ? '고객사,대행사 정보 ↓':'고객사,대행사 정보 ↑'}
                    color="sky-fill"
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
                        isReadOnly: !selectedCustData?.cust_code
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
            <div className="col-span-5 mt-2">
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
            </div>
            {/* 고객요청, 기타 */}
            <div className="grid flex-col w-full grid-cols-2 gap-1">
            <PageGrid
                    title={
                        <><LabelGrid id={'고객 요청'} textColor="blue-700" /></>}
                    right={<> </>}>
                    <div className="grid flex-row w-full grid-cols-2 gap-1">
                        <div className="col-span-2">
                        <TextArea id={"depl_req"} rows={2} cols={0}
                            value={custDetailData?.depl_req}
                            options={{
                                inline: true,
                                isReadOnly: !selectedCustData?.cust_code
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
                        <ReactSelect
                            id="DTD  - X" dataSrc={{}}
                            height="h-6"
                            options={{
                                keyCol: "transport_type",
                                displayCol: ['transport_type_nm'],
                                defaultValue: '',
                                isAllYn: false,
                                inline:true,
                                isReadOnly: !selectedCustData?.cust_code
                            }}/> 
                        <div className="col-span-2">
                            <TextArea id={"DTD 입력사항 - X"} rows={2} cols={0}
                                value={'1234567\n12345'}
                                options={{
                                    inline: true,
                                    isReadOnly: !selectedCustData?.cust_code
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <TextArea id={"op_detail"} rows={2} cols={0}
                                value={custDetailData?.op_detail}
                                options={{
                                    inline: true,
                                    isReadOnly: !selectedCustData?.cust_code
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <TextArea id={"wh_etc"} rows={2} cols={0}
                                value={custDetailData?.wh_etc}
                                options={{
                                    inline: true,
                                    isReadOnly: !selectedCustData?.cust_code
                                }}
                            />
                        </div>
                    </div>
                </PageGrid>
                <div className="ml-10">
                    <PageGrid
                        title={
                            <><LabelGrid id={'etc'} textColor="blue-700" /></>}
                        right={<></>}>
                        <div className="grid flex-col w-full h-full grid-cols-1 gap-1">
                            <EditorQuill id='etc' height="350px" value={custDetailData?.etc}
                                onContentChange={(content) => {
                                    if (custDetailData) custDetailData['etc'] = content;
                                }}
                            />
                        </div>
                    </PageGrid>
                </div>
            </div>
        </div>
    );
}

export default MainPage;