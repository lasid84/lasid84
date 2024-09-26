type ExcelDataLocation = {
    [key: string] : string
};

type ReportDownloadRequest = {
    responseType: number,
    fileExtension: number,
    templateTypeList?: string[],
    reportDataList?: ExcelDataLocation[],
    fileNameList?: string[],
    // 삭제 예정
    pageDivide?: number,
}

type ReportDownloadResponse = {
    contentType: string,
    fileData: Buffer,
    extension: string
}

type FileUploadData = {
    fileName: string,
    fileData: Buffer,
    fileRootDIR: string
}

type FileUploadRequest = {
    addFolderName: string,
    files: FileUploadData[]
}

export type {
    ReportDownloadRequest,
    ReportDownloadResponse,
    FileUploadRequest,
    FileUploadData
}