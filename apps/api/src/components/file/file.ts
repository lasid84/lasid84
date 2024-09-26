import { Request, Response } from "express";
import path from "node:path";
import fs from 'fs';
import { promisify } from 'util';

import upload from 'express-fileupload'
import Excel from 'exceljs';
import libre from 'libreoffice-convert';
(libre as any).convertAsync = promisify(libre.convert);

import util from './util';
import constant from './constant';

import { ReportDownloadRequest, ReportDownloadResponse, FileUploadRequest } from './type';

/**
 * @API_DESCRIPTION
 * [ SUMMARY ]
 * - Booking Report 파일 다운로드를 위한 API
 * 
 * [ REQUEST ]
 * 1. reportData
 *    #1. excel Template에 들어갈 위치 및 값
 * 2. templateType => templateName
 *    #1. 템플릿 형식 (1. 부킹노트 2. 운송요청서 3. 고객발송용)
 * 3. fileExtension
 *    #1. 파일 형식 (0. Excel, 1 : pdf)
 * 4. fileName
 *    #1. 다운로드 될 파일 이름.
 * 5. pageDivide
 *    #1. 페이지 구분선 추가 열.
 * 
 * [ RESPONSE ]
 * - 사용자가 선택한 파일 형식으로 REPORT 다운로드
 */
export const reportDownload = async( req : Request, res : Response ) => {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(401).json({ errorMessage : "Access token not provided" });
    }

    const request : ReportDownloadRequest = req.body;

    /**
     * @dev
     * Select Report File Template.
     */
    const filePath = util.selectTemplateFile(request.templateTypeList);
    if (filePath.length === 0) {
        return res.status(500).json({ errorMessage : "Choose Correct Template Type Number." });
    }

    let responseList = [];
    for  (let i=0; i<filePath.length; i++) {
        const isExists = fs.existsSync(filePath[i]);
        if (!isExists) {
            return res.status(410).json({ errorMessage : "Thers's no exists template file." });
        }

        try {
            /**
             * @dev
             * Fill Data to Excel.
             */
            const workBook = new Excel.Workbook();
            await workBook.xlsx.readFile(filePath[i]);

            const workSheet = workBook.worksheets[0];
            const initialPageSetting = workSheet.pageSetup;

            for (let location in request.reportDataList[i]) {
                if (location === "") {
                    continue;
                }
                workSheet.getCell(location).value = request.reportDataList[i][location];
                workSheet.getCell(location).alignment = {...workSheet.getCell(location).alignment, wrapText: true};
            }

            // workSheet.pageSetup = initialPageSetting;

            workSheet.pageSetup = {
                margins : initialPageSetting.margins,
                horizontalCentered : true,
                verticalCentered : true,
                fitToPage : true,
                fitToWidth : 1,
                scale : 100,
                paperSize : initialPageSetting.paperSize,
                printArea : initialPageSetting.printArea
            }

            if (request.pageDivide !== 0 || undefined || null) {
                const pageBreakRow = workSheet.getRow(request.pageDivide);
                pageBreakRow.addPageBreak();
                workSheet.pageSetup.fitToHeight = 2;
            } else {
                workSheet.pageSetup.fitToHeight = 1;
            }

            const excelBuffer : Buffer = await workBook.xlsx.writeBuffer() as Buffer;

            /**
             * @dev
             * Select response according to fileExtension.
             */
            let response : ReportDownloadResponse;

            if (request.fileExtension) {

                 let data = await (libre as any).convertAsync(excelBuffer, 'pdf', undefined);

                response = {
                    fileData : data,
                    contentType : constant.PDF_CONTENT_TYPE,
                    extension : constant.PDF_FILE_EXTENSION
                }
            } else {
                response = {
                    fileData : excelBuffer,
                    contentType : constant.XLSX_CONTENT_TYPE,
                    extension : constant.XLSX_FILE_EXTENSION
                }
            }

            // if (request.responseType === 0) {
            //     res.setHeader('Content-Disposition', 'attachment');
            //     res.setHeader('Content-Type', response.contentType);
            //     res.attachment(request.fileNameList[i] + response.extension);

            //     console.log(typeof response.fileData, typeof excelBuffer)

            //     return res.status(200).send(response.fileData);
            // } else {
                responseList.push(response);
            // }
        } catch (err) {
            return res.status(500).json({ errorMessage : "Error occurs While change excel file value.", error : err });
        }
    }

    return res.status(200).send(responseList);
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
export const reportUpload = async( req : Request, res : Response ) => {
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

        const uploadPath = path.join(process.cwd(), constant.BASE_PATH + fileName);
        
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
 * @API_DESCRIPTION
 * [ SUMMARY ]
 * 서버에 파일을 업로드하기 위한 API
 * 
 * [ REQUEST ]
 * - add_folder_name : 루트 디렉토리에서 추가될 폴더 이름
 * - files :
 *    # file_name : 파일 이름
 *    # file_data : 파일 데이터 ArrayBuffer
 *    # file_root_dir : 사용할 파일저장소 루트 디렉토리
 *       (ex : 메일 기능 : MAIL, 템플릿 파일 : TEMPLATE)
 * 
 * [ RESPONSE ]
 * 파일이 업로드 된 경로 배열
 */
export const fileUpload = (req: Request, res: Response) => {
  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    return res.status(401).json({ errorMessage : "Access token not provided" });
  }

  const request : FileUploadRequest = req.body;
  console.log("request : ", request);
  const filePathResponse = [];

  for (const [key, _] of Object.entries(request.files)) {
    const fileData = request.files[key];
    const fileRootDir = constant.FILE_REGISTRY_PREFIX.concat(fileData.fileRootDIR);

    const filePathTree = [process.env[fileRootDir.toUpperCase()], request.addFolderName];
    const filePath = util.uploadFile(filePathTree, fileData);
    if (filePath === "") {
        return res.status(500).json({ errorMessage : "Error occurs while file uploading" });
    }

    filePathResponse.push(filePath);
  }

  return res.json(filePathResponse);
}