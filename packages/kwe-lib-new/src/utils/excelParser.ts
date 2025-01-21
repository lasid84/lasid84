import { log, error } from '@';
import ExcelJS from 'exceljs/dist/exceljs.min.js';
import Papa, { ParseResult, ParseError } from 'papaparse';

type Options = {
    fileExtension?: string
}

export const readFile = async (arrayBuffer: ArrayBuffer, options?: Options) => {
    try {
        
        const { fileExtension = '' } = options || {};
        
        let excelDatas: any[] = [];
        if (fileExtension.toUpperCase() === 'CSV') {
            excelDatas = await parseCSV(arrayBuffer) || [];
        } else {
            excelDatas = await parseExcel(arrayBuffer) || [];
        }       

        return excelDatas;

    } catch (err) {
        error("err", err);
    }
}


const parseExcel = async (arrayBuffer: ArrayBuffer) => {
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

/**
 * @param arrayBuffer - CSV 파일 데이터가 담긴 ArrayBuffer
 * @returns CSV 데이터가 담긴 객체 배열을 Promise로 반환
 */
const parseCSV = (arrayBuffer: ArrayBuffer): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      try {
        // ArrayBuffer를 문자열로 디코딩
        const csvString = new TextDecoder().decode(arrayBuffer);
        Papa.parse(csvString as any, {
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