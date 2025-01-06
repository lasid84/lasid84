import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import * as XLSX from 'xlsx-js-style';
import * as ExcelJS from 'exceljs';
// import { ParsingOptions, SSF } from "xlsx";

import { toastError } from "components/toast";
import { useTranslation } from "react-i18next";
import { gridData } from "../grid/ag-grid-enterprise";
import { useUserSettings } from "@/states/useUserSettings";
import { CircularProgress } from "@mui/material";
import LoadingComponent from "../loading/loading";

const { log } = require("@repo/kwe-lib/components/logHelper");
const { getKoreaTime, DateToString, DateToFullString } = require("@repo/kwe-lib/components/dataFormatter.js");

const validExtensions = [".xlsx", ".xls", ".csv", ".XLSX", ".XLS"];

// FileUpload 컴포넌트
interface FileUploadProps {
    onFileDrop?: (data: any[], header:any[], file?: any) => void;
    isInit?: boolean;
    headerRow?: number;
    isReturnRawData?: boolean; //가공되기전 엑셀데이터 그대로 리턴
}

export const FileUpload: React.FC<FileUploadProps> = (props) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const {headerRow = 1, isReturnRawData = false} = props;
    // const [data, setData] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0); 

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
        setIsLoading(true);
        setProgress(0);

        const totalFiles = files.length;
        let processedFiles = 0;
        
        for (const file of files) {
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header : 1, raw: false}); //모든 데이터 가져옴
                        let data;
                        let columnNames:any = [];

                        if (isReturnRawData) {
                            data = jsonData;
                        } else {
                            // 모든 셀의 주소 가져오기
                            columnNames = jsonData[headerRow - 1] as string[]; // 헤더 행 추출
                            
                            const cellAddresses = Object.keys(worksheet);

                            // 첫 번째 행의 셀 주소만 필터링
                            // const firstRowAddresses = cellAddresses.filter(address => address.match(/^[A-Z]+1$/));

                            // 첫 번째 행의 셀 주소를 순회하면서 컬럼명 추출
                            // const columnNames = firstRowAddresses.map(address => worksheet[address].v);

                            // 헤더 이후의 데이터 추출
                            data = jsonData.slice(headerRow).map((row) => {
                                const rowArray = row as any[]; // row를 배열로 캐스팅
                                const rowObject: Record<string, any> = {};
                                columnNames.forEach((col: string, index: number) => {
                                    // if (rowArray[index] instanceof Date) {
                                    //     // log("============", rowArray[index], getKoreaTime(rowArray[index]))
                                    //     rowObject[col] = getKoreaTime(rowArray[index]);
                                    // } else {
                                        rowObject[col] = rowArray[index];
                                    // }
                                });
                                
                                return rowObject;
                            });
                        }
                        if (props.onFileDrop) props.onFileDrop(data, columnNames, file);

                    } catch (err) {

                    } finally {
                        processedFiles += 1;
                        setProgress(Math.round((processedFiles / totalFiles) * 100));

                        if (processedFiles === totalFiles) {
                            setIsLoading(false);
                        }
                    }
                };

                reader.onerror = () => {
                    toastError(t("MSG_0188")); //파일을 읽는 중 오류가 발생했습니다.
                    setIsLoading(false);
                };

                reader.readAsArrayBuffer(file);
            }
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
                    ? "flex-grow border-2 border-blue-600 border-dashed"
                    : "flex-grow border-2 border-gray-200 border-dashed"
            }>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-20 h-20 mb-6">
                            <LoadingComponent noText={true} />
                        </div>
                        <p className="text-lg text-center text-white">
                            {progress}{t("MSG_0189")}
                        </p>
                    </div>
                </div>
            )}
            {/* {!!selectedFiles && selectedFiles.length > 0 ? (
                <div className="flex flex-col items-start p-8">
                {selectedFiles.map((file: any) => (
                    <p key={file?.path}>{`File : ${file?.name || ""}`} </p>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full p-2">
                <input {...getInputProps()} accept=".xlsx, .xls" />
                <BiUpload size={60} className="stroke-current" />
                <p className="pt-2">{t('MSG_0165')}</p>
                </div>
            )} */}
            <input {...(isLoading ? {} : getInputProps())} accept=".xlsx, .xls" />
            {!!selectedFiles && selectedFiles.length > 0 ? (
                <div className="flex flex-col items-start p-8">
                    {selectedFiles.map((file: any) => (
                        <p key={file?.path}>{`File : ${file?.name || ""}`}</p>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full p-2">
                    <BiUpload size={60} className="stroke-current" />
                    <p className="pt-2">{t('MSG_0165')}</p>
                </div>
            )}
            </div>
        </div>
    )
}

//운송사 메일발송 어태치 업로드
export const AttFileUpload: React.FC<FileUploadProps> = (props) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        if (props.isInit) setSelectedFiles([]);
    }, [props.isInit])
    
    // 파일을 Dropzone에 드랍했을 때 처리
    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles); // 파일 상태 업데이트
        
        const fileDatas : ArrayBuffer[] = [];
        // 파일을 읽고 처리
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                fileDatas.push(arrayBuffer);
                if (fileDatas.length === acceptedFiles.length) {
                    if (props.onFileDrop) {
                        props.onFileDrop(acceptedFiles, fileDatas); // 최신 파일 목록을 전달
                    }
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileDrop });

    return (
        <div {...getRootProps({ className: "col-span-12 w-full flex-grow" })}>
            <div
                className={
                    isDragActive
                    ? "flex-grow border-2 border-blue-600 border-dashed"
                    : "flex-grow border-2 border-gray-200 border-dashed"
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