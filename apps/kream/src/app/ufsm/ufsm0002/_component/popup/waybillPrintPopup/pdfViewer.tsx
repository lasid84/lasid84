import React, { useEffect, useRef, useState, forwardRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
import * as type from './types/type';
import { SCALEUP_MODE } from './types/constant';
import { assignInputBox } from './common';

pdfjsLib.GlobalWorkerOptions.workerSrc = "/service/pdf.worker.mjs";

const PDFViewer = forwardRef<HTMLDivElement, type.PDFViewerProps>(({ pdfPath, scale=1.5, setInputValues, detailData }, printAreaRef) => {
    const canvasAreaRef = useRef<HTMLDivElement>(null);

    const [PDFDocument, setPDFDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setInputValues((prevState) => prevState.set( id, value ));
    };

    const renderPage = async (pageIDX: number): Promise<HTMLDivElement | null> => {
        if (!PDFDocument || !canvasAreaRef.current)
            return null;

        const canvasArea = Object.assign(document.createElement('div'));
        canvasArea.style.position = 'relative';
        canvasAreaRef.current.appendChild(canvasArea);

        const page = await PDFDocument.getPage(pageIDX);
        const viewport = page.getViewport({ scale });

        const canvas = Object.assign(document.createElement('canvas'),{
            width: viewport.width,
            height: viewport.height,
            className: "pdf-canvas overflow-scroll" 
        });
        canvasArea.appendChild(canvas);

        const context = canvas.getContext('2d');
        if (context) {
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
        }

        const resultPageContainer = assignInputBox(canvasArea, SCALEUP_MODE, null, handleInputChange, detailData);
        
        return resultPageContainer;
    }

    const selectPages = async () => {
        if (!PDFDocument)
            return;
        
        for (let page = 1; page <= PDFDocument.numPages; page++) {
            await renderPage(page);
        }
    }

    const loadingPDF = async () => {
        try {
            const pdfDocument = await pdfjsLib.getDocument(pdfPath).promise;
            setPDFDocument(pdfDocument);
        } catch (error) {

        }
    };

    const initializePDFDocument = () => {
        if (PDFDocument) {
            canvasAreaRef.current!.innerHTML = '';
            selectPages();
        }
    }

    useEffect(() => {
        loadingPDF();
    }, [pdfPath, detailData]);

    useEffect(() => {
        initializePDFDocument();
    }, [PDFDocument, scale]);

    return (
        <div id="printArea" ref={printAreaRef} className="flex justify-center items-center flex-col">
            <div id="canvasArea" ref={canvasAreaRef} className="h-[710px] monitor:h-[926px] w-full relative overflow-scroll">
            </div>
        </div>
    );
});

export default PDFViewer;