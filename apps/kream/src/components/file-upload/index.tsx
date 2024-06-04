

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { ParsingOptions, SSF } from "xlsx";

import { toastError } from "components/toast";
import { useTranslation } from "react-i18next";

const { log } = require("@repo/kwe-lib/components/logHelper");
const { getKoreaTime, DateToString } = require("@repo/kwe-lib/components/dataFormatter.js");

const validExtensions = [".xlsx", ".xls", ".txt", ".LPN", ".xml", ".json", ".csv", ".XLSX", ".XLS"];

// FileUpload 컴포넌트
interface FileUploadProps {
    onFileDrop?: (data: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    // const [data, setData] = useState<any[]>([]);
    
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
                // setData(jsonData);
                // log("jsonData", JSON.stringify(jsonData));
                if (props.onFileDrop) props.onFileDrop(JSON.stringify(jsonData));
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


export default FileUpload;