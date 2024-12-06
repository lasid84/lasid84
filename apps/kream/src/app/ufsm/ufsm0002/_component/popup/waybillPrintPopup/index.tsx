import DialogBasic from "layouts/dialog/dialog";

import { useState, useRef } from "react";
import { useAppContext, SEARCH_MD, LOAD } from "@/components/provider/contextObjectProvider";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import PDFViewer from "./pdfViewer";
import { type, constant } from "./types"
import { assignInputBox } from './utils';

import { SP_GetWBDetailData, SP_GetPrintLocationData } from "../../data";
import { useGetData } from "components/react-query/useMyQuery";

const WaybillPrintPopup: React.FC = () => {
    const { dispatch, objState } = useAppContext();

    const printAreaRef = useRef<HTMLDivElement>(null);

    const [inputValues, setInputValues] = useState(new Map<string, string>());
    const [viewPort, setViewPort] =  useState<type.ViewPort>({width: 0, height: 0});

    const { isPrintPopUpOpen: isOpen, dSelectedNo: waybillNo } = objState;

    const { data: detailData } = useGetData({ wb_no: waybillNo }, SEARCH_MD, SP_GetWBDetailData, { staleTime: 1000 * 60 * 60 });
    const { data: locationData } = useGetData({ type: constant.DOCUMNET_TYPE }, LOAD, SP_GetPrintLocationData, { staleTime: 1000 * 60 * 60 });
    
    const { t } = useTranslation();

    const handleViewPort = () => (viewPort: type.ViewPort) => {
        setViewPort(viewPort);
    };

    const handleInputChange = () => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setInputValues((prevState) => prevState.set( id, value ));
    };

    const handleClose = () => {
        setInputValues(new Map<string, string>());
        dispatch({ isPrintPopUpOpen: false });
    };

    const handlePrint = () => {
        const printArea = printAreaRef.current as HTMLDivElement;

        const onlyTextPrintArea = Object.assign(document.createElement('div'));
        onlyTextPrintArea.style.cssText = `
            position: relative;
            width: ${constant.WEB_A4_WIDTH}px;
            height: ${constant.WEB_A4_HEIGHT}px;
        ` 
        printArea.appendChild(onlyTextPrintArea);

        const param: type.assignLocationParam = {
            container: onlyTextPrintArea,
            mode: constant.ORIGIN_MODE,
            locationData: locationData,
            inputValues: inputValues,
            viewPort: viewPort
        };
        printArea.appendChild(assignInputBox(param));

        const newWindow = window.open("", "_blank", "width=793 height=1122") as Window;
        const printMediaQuery = document.createElement('style');
        printMediaQuery.innerHTML = `@media print { html, body { width: ${constant.WEB_A4_WIDTH}px; height: ${constant.WEB_A4_HEIGHT}px; max-height: 1122px; overflow: hidden; margin:0; } header, footer, .no-print { display:none; } } @page { margin:0; } @font-face { font-family: 'Courier Prime'; src: url('/fonts/CourierPrime-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; } body { font-family: Courier Prime; }`;

        const handleAfterPrint = () => {
            newWindow.close();
            newWindow.removeEventListener("afterprint", handleAfterPrint);
        }
        
        newWindow.addEventListener("afterprint", handleAfterPrint);
        newWindow.document.head.appendChild(printMediaQuery);
        newWindow.document.body.appendChild(onlyTextPrintArea);

        newWindow.document.fonts.ready.then(() => {
            setTimeout(() => {
                newWindow.print();
            }, 1000);
        });
    };

    const PDFViewerProps = {
        pdfPath: "/template/air_waybill.pdf",
        ref: printAreaRef,
        detailData: detailData,
        locationData: locationData,
        handleInputChange: handleInputChange(),
        handleViewPort: handleViewPort()
    };

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
            <PDFViewer {...PDFViewerProps}  />
        </DialogBasic>
    )
}

export default WaybillPrintPopup;