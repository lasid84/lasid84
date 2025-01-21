import { log, error } from '@';
import * as ExcelJS from 'exceljs';
import Papa, { ParseResult, ParseError } from 'papaparse';
import * as XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';

type Options = {
    fileExtension?: string
}

export const readFile = async (file: File, options?: Options) => {
    try {
        
        const { fileExtension = '' } = options || {};
        
        let excelDatas: any[] = [];
        if (fileExtension.toUpperCase() === 'CSV') {
            excelDatas = await parseCSV(file) || [];
        } else {
            excelDatas = await parseExcelByReadExcel(file);
        }       

        return excelDatas;

    } catch (err) {
        error("err", err);
    }
}

/* 
  1. xlsx 읽히지만 브라우저환경에서 안돌아감(eval 문이 포함되어 있어서 그런듯)
*/
const parseExcelbyExcelJS = async (arrayBuffer: ArrayBuffer) => {
    try {
        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(arrayBuffer);

        // 첫 번째 워크시트 가져오기
        const worksheet = workbook.worksheets[0];

        /* 규격화된 양식이 있으면 추가 */

        const excelDatas: any[] = [];
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rowTexts:any = [];
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                
                if (cell.value instanceof Date) {
                    // log("cell.numFmt", cell, cell.value, cell.value.toISOString(), " / ", cell.value.toUTCString(), " / ", cell.value.toDateString(), " / ", cell.value.toString()
                    // , " / ", cell.value.toLocaleDateString());

                    // 날짜는  2024-11-19T00:00:00.000Z 포맷으로 전달(엑셀에 있는 시간 그대로)
                    rowTexts[colNumber - 1] = cell.value.toISOString();
                } else {
                    rowTexts[colNumber - 1] = cell.value;
                }
              });
            excelDatas.push(rowTexts);


            // excelDatas.push(row.values);
        });

        return excelDatas;

    } catch (err) {
        error("err", err);
    }
}

/* 
  1. xlsx, csv 모두 읽을 수 있으나 chrom 132.0.6834.84 버전에서 대용량 파일 읽은 오류
     (row수는 맞으나 내용이 안읽혀옴)
*/
const parseExcelByxlsx = async (arrayBuffer: ArrayBuffer) => {

  const workbook = await XLSX.read(arrayBuffer, { type: 'array', raw:true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw:true});
  return jsonData;
};

/* 
  1. xlsx 읽기만 됨
*/
const parseExcelByReadExcel = async (file: File) => {
  const excelRows = await readXlsxFile(file);
  return excelRows
}

/**
 * 1. CSV만 읽힘
 */
const parseCSV = (file: File): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        // ArrayBuffer를 문자열로 디코딩
        // const csvString = new TextDecoder().decode(arrayBuffer);
        const csvString = await file.text();
        Papa.parse( csvString as any, {
          header: false,           // 첫 줄을 헤더로 간주하여 객체로 반환
          dynamicTyping: true,     // 자동으로 데이터 타입 변환
          skipEmptyLines: false,   // 빈 줄 건너뛰기
          complete: (results: ParseResult<any>) => {
            resolve(results.data as any[]);
          },
        //   error: (error: ParseError) => {
        //     reject(error);
        //   }
        });
      } catch (error) {
        reject(error);
      }
    });
  }