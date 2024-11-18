import DialogBasic from "layouts/dialog/dialog";

import { useState, useRef } from "react";
import { useAppContext, SEARCH_MD } from "@/components/provider/contextObjectProvider";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import PDFViewer from "./pdfViewer";
import { ORIGIN_MODE } from './types/constant';
import { assignInputBox } from './common';

import { SP_GetWBDetailData } from "../../data";
import { useGetData } from "components/react-query/useMyQuery";

const WaybillPrintPopup: React.FC = () => {
    const { dispatch, objState } = useAppContext();

    const printAreaRef = useRef<HTMLDivElement>(null);
    const [inputValues, setInputValues] = useState(new Map<string, string>());

    const { isPrintPopUpOpen: isOpen, dSelectedNo: waybillNo } = objState;

    const { data: detailData } = useGetData({ wb_no: waybillNo }, SEARCH_MD, SP_GetWBDetailData, { staleTime: 1000 * 60 * 60 });
    
    const { t } = useTranslation();

    const handleClose = () => {
        setInputValues(new Map<string, string>());
        dispatch({ isPrintPopUpOpen: false });
    }

    const handlePrint = () => {
        const printArea = printAreaRef.current as HTMLDivElement;

        const onlyTextPrintArea = Object.assign(document.createElement('div'));
        onlyTextPrintArea.style.cssText = `
            position: relative;
            width: 793px;
            height: 1122px;
        `
        printArea.appendChild(onlyTextPrintArea);

        printArea.appendChild(assignInputBox(onlyTextPrintArea, ORIGIN_MODE, inputValues))

        const newWindow = window.open("", "_blank", "width=793 height=1122") as Window;
        const printMediaQuery = document.createElement('style');
        printMediaQuery.innerHTML=`@media print { html, body { width: 793px; height: 1122px; max-height: 1122px; overflow: hidden; margin:0; } header, footer, .no-print { display:none; } } @page{ margin:0; } @font-face { font-family: 'Courier Prime'; src: url('/fonts/CourierPrime-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; } body { font-family: Courier Prime;}`;

        const handleAfterPrint = () => {
            newWindow.close();
            newWindow.removeEventListener("afterprint", handleAfterPrint);
        }
        
        newWindow.addEventListener("afterprint", handleAfterPrint);
        newWindow.document.head.appendChild(printMediaQuery);
        newWindow.document.body.appendChild(onlyTextPrintArea);

        setTimeout(() => {
            newWindow.print();
        }, 100);
    }

    return (
        <DialogBasic
            isOpen={isOpen!}
            onClose={handleClose}
            title={t("air_waybill_print")}
            bottomRight={
                <>
                    <Button id={"print"} onClick={handlePrint} icon={null}/>
                    <Button id={"cancel"} onClick={handleClose} />
                </>
            }
        >
            <PDFViewer pdfPath={"/template/air_waybill.pdf"} setInputValues={setInputValues} ref={printAreaRef} detailData={detailData} />
        </DialogBasic>
    )
}

export default WaybillPrintPopup;