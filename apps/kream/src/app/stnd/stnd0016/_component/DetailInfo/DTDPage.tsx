import { useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { ReactSelect, data } from "components/select/react-select2";
import { PageGrid } from "@/layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import CustChargeGrid from "./Common/CustChargeGrid";
import RateByCharge from "./DTDDetail/RateByCharge";
import { t } from "i18next";
import { useCommonStore } from "../../_store/store";
import { Checkbox } from "@/components/checkbox";
import { gridData } from "@/components/grid/ag-grid-enterprise";

import { log } from '@repo/kwe-lib-new';



export interface typeloadItem {
    data: {} | undefined
}
type Props = {

};

const MainPage: React.FC<Props> = memo(() => {

    const loadDatas = useCommonStore((state) => state.loadDatas);
    const selectedCharge = useCommonStore((state) => state.selectedCharge) || '';
    const selectedCustData = useCommonStore((state) => state.selectedCustData);
    const custDetailData = useCommonStore((state) => state.custDetailData);
    
    return (
        <div className="m-2">
            <div className="grid md:grid-cols-5">
               {/* <Checkbox id={"dtd_bill_yn"}
                    value={custDetailData?.dtd_bill_yn}
                    readOnly={!selectedCustData?.cust_code}
                    options={{
                        inline:true
                    }}
               /> */}
                <ReactSelect
                    id="payment_type" dataSrc={loadDatas?.[5] as gridData}
                    height="h-6"
                    options={{
                        keyCol: "cd",
                        displayCol: ['cd', 'cd_nm'],
                        defaultValue: custDetailData?.payment_type,
                        isAllYn: false,
                        inline:true,
                        isReadOnly:!selectedCustData?.cust_code
                    }}/>   
            </div>

            <div className="mt-1">
                <LabelGrid id={'차지 설정'} textColor="blue-700" />
                <div className="flex-col grid grid-cols-1 w-full h-[110px]">
                    <CustChargeGrid shipping_type='DTD'/>
                </div>
            </div>

            <div className="col-span-4">
                <LabelGrid id={'요율설정'} textColor="blue-700" />
                <RateByCharge/>        
            </div>

            <div className="grid flex-col w-full grid-cols-2 gap-1">
                <div className="col-span-1">
                    <LabelGrid id={'dtd_cust_requet'} textColor="blue-700" />
                    <TextArea id={"dtd_cust_requet"} rows={5} cols={0}
                        value={custDetailData?.dtd_cust_requet}
                        options={{
                            inline: true,
                            noLabel: true
                        }}
                    />
                </div>
                <div className="col-span-1">
                    <LabelGrid id={'remark'} textColor="blue-700" />
                    <TextArea id={"dtd_remark"} rows={5} cols={0}
                        value={custDetailData?.dtd_remark}
                        options={{
                            inline: true,
                            noLabel: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default MainPage;