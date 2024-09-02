import { Request, Response } from "express";
import path from "node:path";
import upload from 'express-fileupload'
import fs from 'fs';
import { promisify } from 'util';

import libre from 'libreoffice-convert';
(libre as any).convertAsync = promisify(libre.convert);

import Excel from 'exceljs';

/**
 * foundation : 
 * 1. value를 그대로 cell에 대체
 * 2. null, undefined 제거
 * 
 * custom : formula
 * 1. column과 column이 합쳐지는 case + 쉼표 등 특수문자로 구분되어지는 case
 * 2. value 앞 뒤로 fixed text가 붙는 case
 * 3. value 값에 따라 shape가 변환되는 case
 * 4. value 그대로 들어가는 것이 아닌 특정 형식으로 변환되어 들어가는 case
 */

const BasePath = "/src/components/data/upload/";

const PdfContentType = "application/pdf";
const XlsxContentType= "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type ExcelDataLocation = {
    [key: string]: {
        [value: string]: string | number;
    };
};

type FileDownloadRequest = {
    templateType: number,
    fileExtension: number,
    reportData: ExcelDataLocation,
    fileName: string
}

type FileDownloadResponse = {
    contentType?: string,
    fileData?: Buffer
}

/**
 * @API_DESCRIPTION
 * [ SUMMARY ]
 * - Booking Report 파일 다운로드를 위한 API
 * 
 * [ REQUEST ]
 * 1. reportData
 *    #1. excel Template에 들어갈 위치 및 값
 * 2. templateType => templateName
 *    #1. 템플릿 형식 (1. 부킹노트 2. 운송요청서 3.고객발송용)
 * 3. fileExtension
 *    #1. 파일 형식 (0. Excel, 1 : pdf)
 * 4. fileName
 *    #1. 다운로드 될 파일 이름.
 * 
 * [ RESPONSE ]
 * - 사용자가 선택한 파일 형식으로 REPORT 다운로드
 */
export const fileDownload = async( req : Request, res : Response ) => {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(401).json({ errorMessage : "Access token not provided" });
    }

    const request : FileDownloadRequest = req.body
    let response : FileDownloadResponse;

    /**
     * @dev
     * Select Report File Template.
     */
    const filePath = selectTemplateFile(request.templateType);
    if (filePath === "") {
        return res.status(500).json({ errorMessage : "Choose Correct Template Type Number." });
    }
    const templateFilePath = path.join(process.cwd(), filePath);

    const isExists = fs.existsSync(templateFilePath);
    if (!isExists) {
        return res.status(500).json({ errorMessage : "Thers's no exists template file." });
    }

    try {
        /**
         * @dev
         * Fill Data to Excel.
         */
        const workBook = new Excel.Workbook();
        await workBook.xlsx.readFile(templateFilePath);

        const workSheet = workBook.worksheets[0];

        for (let location in request.reportData) {
            if (location === "") {
                continue;
            }
            workSheet.getCell(location).value = request.reportData[location].value;
        }

        const excelBuffer : Buffer = await workBook.xlsx.writeBuffer() as Buffer;

        /**
         * @dev
         * Select response according to fileExtension.
         */

        if (request.fileExtension) {
            let data = await (libre as any).convertAsync(excelBuffer, '.pdf', undefined);

            response = {
                fileData : data,
                contentType : PdfContentType
            }
        } else {
            response = {
                fileData : excelBuffer,
                contentType : XlsxContentType
            }
        }

        res.set({
            'Content-Disposition': `\'attachment;  filename=\"${request.fileName}\"`,
            'Content-Type': `\'${response.contentType}\'`,
        });

        return res.status(200).send(response.fileData);
    } catch (err) {
        return res.status(500).json({ errorMessage : "Error occurs While change excel file value.", error : err });
    }
}

/**
 * @API_DESCRIPTION
 * [ SUMMARY ]
 * - Report file template 서버 업로드를 위한 API.
 * 
 * [ REQUEST ]
 * 1. template
 *    #1. report template file.
 * 
 * [ RESPONSE ]
 * - 업로드 성공 여부
 */
export const fileUpload = async( req : Request, res : Response ) => {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(401).json({ errorMessage : "Access token not provided" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(500).json( { errMessage : "Invalid File Upload."} )
    }

    try {
        const template = req.files.template as upload.UploadedFile;
        const fileName = template.name;
        
        if (fileName === undefined) {
            return res.status(500).json( { errMessage : "Invalid File Name."} )
        }

        const uploadPath = path.join(process.cwd(), BasePath + fileName);
        
        template.mv(uploadPath, function(err) {
            if (err) {
                return res.status(500).json( { errMessage : "Error occurs while file uploading."} )
            } 
        });

        res.status(200).json("upload success");

    } catch (err) {
        return res.status(500).json({ errorMessage : "Error occurs While change excel file value.", error : err });
    }
};

/**
 * @FUNCTION
 * 템플릿 유형에 따라 사용할 파일 구분을 위한 함수.
 */
const selectTemplateFile = (templateType:number) : string => {
    switch(templateType) {
        case 1:
            return BasePath + "booking_note.xlsx";
        case 2:
            return BasePath + "transport_request.xlsx";
        case 3:
            return BasePath + "customer_dispatch.xlsx";
        default:
            return ""           
    }
}