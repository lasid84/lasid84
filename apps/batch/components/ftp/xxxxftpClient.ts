// import ftp, { Client, AccessOptions, FileInfo } from "basic-ftp";
// import fs from "fs/promises";

// const { log, error } = require("@repo/kwe-lib/components/logHelper");

// class FtpClient {
//     private client: Client;
//     private config: AccessOptions;

//     constructor(config: AccessOptions) {
//         this.client = new Client();
//         this.config = config;
//         this.client.ftp.verbose = true; // 디버깅용 로깅 활성화
//     }

//     // 1. FTP 서버에 접속하는 메서드
//     async connect(): Promise<void> {
//         try {
//             await this.client.access(this.config);
//             console.log("FTP 서버에 성공적으로 접속했습니다.");
//         } catch (error) {
//             console.error("FTP 서버 접속 실패:", error);
//             throw error;
//         }
//     }

//     // 2. 파일을 읽는 메서드 (파일을 임시로 다운로드한 후 Buffer로 변환)
//     async readFile(path: string): Promise<string> {
//         const tempFilePath = "temp_download.txt";
//         try {
//             await this.client.downloadTo(tempFilePath, path);
//             const data = await fs.readFile(tempFilePath, "utf-8");

//             // 다운로드한 임시 파일 삭제
//             await fs.unlink(tempFilePath).catch(() => {});

//             log(`파일을 성공적으로 읽었습니다: ${path}`);
//             return data + "";
//         } catch (err) {
//             error("파일 읽기 실패:", err);
//             return null;
//         } finally {
//             await fs.unlink(tempFilePath).catch(() => {}); // 임시 파일 삭제
//         }
//     }

//     // 폴더 내 모든 파일의 이름과 내용을 읽어서 배열로 반환하는 메서드
//     async readAllFilesInFolder(folderPath: string): Promise<{ fileName: string, content: string }[]> {
//         const filesContent: { fileName: string, content: string }[] = [];
        
//         try {
//             const fileList: FileInfo[] = await this.client.list(folderPath);
//             console.log(`폴더 내 파일 목록 (${folderPath}):`, fileList.map(file => file.name));

//             for (const file of fileList) {
//                 if (file.isFile) { // 파일인 경우에만 처리
//                     const fileContent = await this.readFile(file.name);
//                     // const fileContent = await fs.readFile(tempFilePath, "utf8");
//                     log(file.name, " : ", fileContent)
//                     filesContent.push({ fileName: file.name, content: fileContent });
//                 }
//             }

//             return filesContent;
//         } catch (error) {
//             console.error("폴더 내 파일 읽기 실패:", error);
//             throw error;
//         }
        
//         return filesContent;
//     }

//     // 3. 파일을 다른 위치로 이동하는 메서드
//     async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
//         const tempFilePath = "temp_download.txt";
//         try {
//             // 파일을 임시로 다운로드
//             await this.client.downloadTo(tempFilePath, sourcePath);

//             // 새 위치에 업로드
//             await this.client.uploadFrom(tempFilePath, destinationPath);

//             // 원본 파일 삭제
//             await this.client.remove(sourcePath);

//             console.log(`파일이 ${sourcePath}에서 ${destinationPath}로 이동되었습니다.`);
//         } catch (error) {
//             console.error("파일 이동 실패:", error);
//             throw error;
//         } finally {
//             await fs.unlink(tempFilePath).catch(() => {}); // 임시 파일 삭제
//         }
//     }

//     // 3. FTP 연결 종료 메서드
//     async close(): Promise<void> {
//         this.client.close();
//         console.log("FTP 연결이 종료되었습니다.");
//     }
// }

// export default FtpClient;
