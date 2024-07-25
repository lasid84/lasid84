

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import * as XLSX from 'xlsx-js-style';
import * as ExcelJS from 'exceljs';
// import { ParsingOptions, SSF } from "xlsx";

import { toastError } from "components/toast";
import { useTranslation } from "react-i18next";
import { gridData } from "../grid/ag-grid-enterprise";

const { log } = require("@repo/kwe-lib/components/logHelper");
const { getKoreaTime, DateToString } = require("@repo/kwe-lib/components/dataFormatter.js");

const validExtensions = [".xlsx", ".xls", ".csv", ".XLSX", ".XLS"];

// FileUpload 컴포넌트
interface FileUploadProps {
    onFileDrop?: (data: any[], header:string[]) => void;
    isInit?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = (props) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    // const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (props.isInit) setSelectedFiles([]);
    }, [props.isInit])
    
    // 파일을 Dropzone에 드랍했을 때 처리
    const handleFileDrop = useCallback((files: any) => {
        
        if (!checkValidFileExt()) {
            const errMsg =  t('MSG_0164'); //"업로드 가능한 파일 타입이 아닙니다.\n";
            toastError(errMsg);
            return;
        }
        
        setSelectedFiles(files);        
        var file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // 모든 셀의 주소 가져오기
                const cellAddresses = Object.keys(worksheet);

                // 첫 번째 행의 셀 주소만 필터링
                const firstRowAddresses = cellAddresses.filter(address => address.match(/^[A-Z]+1$/));

                // 첫 번째 행의 셀 주소를 순회하면서 컬럼명 추출
                const columnNames = firstRowAddresses.map(address => worksheet[address].v);

                jsonData.forEach((row:any) => {
                    Object.keys(row).forEach((key) => {
                    // if (XLSX.SSF.is_date(row[key])) {
                    //     row[key] = XLSX.SSF.to_general(row[key]);
                    // }
                        if (row[key] instanceof Date) {
                            row[key] = DateToString(getKoreaTime(row[key]));
                        }
                    });
                });
                if (props.onFileDrop) props.onFileDrop(jsonData, columnNames);
            };
            reader.readAsArrayBuffer(file);

            // const reader = new FileReader();

            // reader.onload = (e: ProgressEvent<FileReader>) => {
            //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
            //     const workbook = XLSX.read(data, { type: 'array', cellDates: true });

            //     const firstSheetName = workbook.SheetNames[0];
            //     const worksheet = workbook.Sheets[firstSheetName];

            //     // const jsonData: (string | number | Date)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 3 });
            //     const jsonData : any = XLSX.utils.sheet_to_json(worksheet);

            //     const formattedData = jsonData.map((row:any) => 
            //         Object.values(row).map((cell:any) => (cell instanceof Date) ? cell.toISOString().split('T')[0] : cell.toString())
            //     );
            //     log("formattedData", formattedData);
            //     setData(formattedData);
            // };

            // reader.readAsArrayBuffer(file);

        }
    }, []);

    // File 타입 Validation
    const checkValidFileExt = useCallback(() => {
        const isValid = selectedFiles.every((file: any) => {
            const ext = file?.name.slice(file?.name.lastIndexOf("."));
            return validExtensions.includes(ext);
        });
        return isValid;
    }, [selectedFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileDrop });

    return (
        <div {...getRootProps({ className: "col-span-12 w-full flex-grow" })}>
            <div
                className={
                    isDragActive
                    ? "flex-grow border-2 border-dashed border-blue-600"
                    : "flex-grow border-2 border-dashed border-gray-200"
            }>
            {!!selectedFiles && selectedFiles.length > 0 ? (
                <div className="flex flex-col items-start p-8">
                {selectedFiles.map((file: any) => (
                    <p key={file?.path}>{`File : ${file?.name || ""}`}</p>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full p-2">
                <input {...getInputProps()} accept=".xlsx, .xls" /*multiple*/ />
                <BiUpload size={60} className="stroke-current" />
                <p className="pt-2">{t('MSG_0165')}</p>
                </div>
            )}
            </div>
        </div>
    )
}

// export const downloadExcel = (data: [], filename: string) => {
//     if (data.length === 0) return;

//     const allStyle = {
//         border: {
//           top: { style: 'thin' },
//           right: { style: 'thin' },
//           bottom: { style: 'thin' },
//           left: { style: 'thin' }
//         }
//       };

//     var excelForm:any[] = data;
//     const worksheet = XLSX.utils.json_to_sheet(excelForm, {skipHeader:true});
//     const workbook = XLSX.utils.book_new();
//     worksheet['A1'].s = {font:{s:24}}
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');  
    
//     const styles = {
//         all: {
//           border: {
//             top: { style: 'thin' },
//             right: { style: 'thin' },
//             bottom: { style: 'thin' },
//             left: { style: 'thin' }
//           }
//         },
//         header: {
//           font: {
//             name: 'Arial',
//             size: 12,
//             bold: true
//           }
//         },
//         data: {
//           font: {
//             name: 'Arial',
//             size: 10
//           }
//         }
//     };
      
//     XLSX.utils.sheet_add_aoa(worksheet, [['', ''], []], { cellStyle: styles['all'] });
    
//     XLSX.writeFile(workbook, filename);
// };

// export const createExcelFile = async (data: gridData, skipHeader = true) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sheet1');

//   if (skipHeader) {
//     // 제목 행 설정
//     const headerRow = data.fields.map((obj:{name:string}) => obj.name);
//     headerRow.forEach((title:string, colIndex:number) => {
//         worksheet.getColumn(colIndex + 1).header = title;
//     });
//   }

//   const rows = data.data.map((obj:Object) => Object.values(obj))
//   // 데이터 행 추가
//   rows.forEach((row:[], rowIndex:number) => {
//     worksheet.getRow(rowIndex + 2).values = row;
//   });

//   log("---", rows);

//   // 테두리 설정
//   worksheet.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: 'thin' },
//         right: { style: 'thin' },
//         bottom: { style: 'thin' },
//         left: { style: 'thin' }
//       };
//     });
//   });

//   // 글자 크기 설정
//   worksheet.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.font = { size: 10 };
//     });
//   });

//   // 특정 열 너비 조정 (선택 사항)
//   worksheet.getColumn(2).width = 20;

//   // 엑셀 파일 저장
//   await workbook.xlsx.writeFile('output.xlsx');
// };

export const downloadExcel = (data: [], filename: string, colWidth:number[], skipHeader = true) => {
    // JSON 데이터를 엑셀 시트로 변환
    const excelForm = data;
    const worksheet = XLSX.utils.json_to_sheet(excelForm, { skipHeader: skipHeader });

    if (colWidth.length) {
        var width = colWidth.map(w => {
            var obj = {wpx:w}
            return obj;
        });
        worksheet['!cols'] = width;

        log(width)
    }

    // 스타일 설정
    if (worksheet['!ref']) { // 'undefined' 체크
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!worksheet[cell_ref]) continue;

            // 셀 스타일 지정
            worksheet[cell_ref].s = {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
                },
                font: {
                sz: 10,
                bold: true,
                color: { rgb: "000000" }
                }
            };
            }
        }
    }

    // 워크북에 시트 추가
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 파일 쓰기
    XLSX.writeFile(workbook, filename);
}