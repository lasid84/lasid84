type ExcelDataLocation = {
    [key: string] : string
};

type ReportDownloadRequest = {
    templateType: number,
    fileExtension: number,
    reportData: ExcelDataLocation,
    fileName: string,
    pageDivide: number
}

type ReportDownloadResponse = {
    contentType: string,
    fileData: Buffer,
    extension: string
}

type FileUploadData = {
    file_name: string,
    file_data: ArrayBuffer,
    file_root_dir: string
}

type FileUploadRequest = {
    add_folder_name: string,
    files: FileUploadData[]
}

export type {
    ReportDownloadRequest,
    ReportDownloadResponse,
    FileUploadRequest,
    FileUploadData
}