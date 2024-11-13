// import ftp, { Client, AccessOptions, FileInfo } from "basic-ftp";
// import fs from "fs/promises";

const ftp = require("basic-ftp")
const { Client, AccessOptions, FileInfo } = require("basic-ftp") ;
const fs = require('fs/promises');
const path = require("path");
// const { log, error } = require("@repo/kwe-lib/components/logHelper");

class FtpClient {
    client;
    config;
    isConnected = false;
    timeout = null;
    idleTime = 1 * 60 * 1000;

    constructor(config) {
        this.config = {...config, secure:false};
        // this.client.ftp.verbose = true; // 디버깅용 로깅 활성화
    }

    // 1. FTP 서버에 접속하는 메서드
    async connect() {
        try {
            if (!this.isConnected) {
                this.client = new Client();
                await this.client.access(this.config);
                this.isConnected = true;
            // console.log("FTP 서버에 성공적으로 접속했습니다.");
            }
            this.resetTimeout();
        } catch (error) {
            console.error("FTP 서버 접속 실패:", error);
            throw error;
        }
    }

    async donwloadFile(path, fileName) {
        try {
            const uniqueName = await this.getUniqueLocalFileName(fileName);
            await this.client.downloadTo(uniqueName, path + "/" + fileName);

            return uniqueName;
        } catch (err) {
            console.error("파일 읽기 실패:", err);
            return null;
        } finally {
            this.resetTimeout();
        }
    }

    // 2. 파일을 읽는 메서드 (파일을 임시로 다운로드한 후 Buffer로 변환)
    async readFile(fileName) {
        const tempFilePath = "temp_download.txt";
        try {
            
            const data = await fs.readFile(fileName, "utf-8");
            // log(`파일을 성공적으로 읽었습니다: ${path}`);
            return data + "";
        } catch (err) {
            console.error("파일 읽기 실패:", err);
            return null;
        } finally {
            // await fs.unlink(tempFilePath).catch(() => {}); // 임시 파일 삭제
            this.resetTimeout();
        }
    }

    // 폴더 내 모든 파일의 이름과 내용을 읽어서 배열로 반환하는 메서드
    async readAllFilesInFolder(folderPath) {
        const filesContent = [];
        
        try {
            const curPath = await this.client.pwd();
            await this.client.cd(folderPath);
            const fileList = await this.client.list();
            await this.client.cd(curPath);

            return fileList;
        } catch (error) {
            console.error("폴더 내 파일 읽기 실패:", error);
            throw error;
        } finally {
            this.resetTimeout();
        }
    }

    // 3. 파일을 다른 위치로 이동하는 메서드
    async moveFile(sourcePath, destinationPath) {
        const tempFilePath = "temp_download.txt";
        try {
            // 파일을 임시로 다운로드
            await this.client.downloadTo(tempFilePath, sourcePath);

            // 새 위치에 업로드
            await this.client.uploadFrom(tempFilePath, destinationPath);

            console.log(`파일이 ${sourcePath}에서 ${destinationPath}로 이동되었습니다.`);
        } catch (error) {
            console.error("파일 이동 실패:", error);
            throw error;
        } finally {
            // await fs.unlink(tempFilePath).catch(() => {}); // 임시 파일 삭제
            this.resetTimeout();
        }
    }

    // 3. 파일을 다른 위치로 이동하는 메서드
    async uploadFile(sourcePath, destinationPath) {
        try {
            // 새 위치에 업로드
            await this.client.uploadFrom(sourcePath, destinationPath);

            return true;
        } catch (error) {
            console.error("파일 업로드 실패:", error);
            throw error;
        } finally {
            this.resetTimeout();
        }
    }

    async removeLocalFile (fileName) {
        try {
            await fs.unlink(fileName).catch(() => {});
        } catch (error) {
            console.error("로컬파일 삭제 실패:", error);
            throw error;
        } finally {
            this.resetTimeout();
        }
    }

    async removeFile(path) {
        try {
            // 원본 파일 삭제
            await this.client.remove(path);
        } catch (error) {
            console.error("파일 삭제 실패:", error);
            throw error;
        } finally {
            this.resetTimeout();
        }
    }

    // 고유한 파일명을 생성하는 메서드
    async getUniqueLocalFileName(filePath) {
        let uniquePath = path.normalize(filePath);
        let count = 1;
        
        // 파일이 존재하는지 확인하면서 고유한 이름을 찾음
        while (true) {
            try {
                await fs.access(uniquePath);  // 파일이 존재하면 예외 발생 안함
                const ext = path.extname(filePath);
                const base = path.basename(filePath, ext);
                uniquePath = `${base}(${count})${ext}`;
                count += 1;
            } catch {
                // 파일이 존재하지 않으면 루프를 벗어남
                break;
            }
        }
        return uniquePath;
    }

    async getUniqueRemoteFileName(remoteDir, fileName) {
        const ext = path.extname(fileName);
        const base = path.basename(fileName, ext);
        let uniqueName = fileName;
        let count = 1;

        const curPath = await this.client.pwd();
        // FTP 서버에서 파일 목록 확인
        await this.client.cd(remoteDir);
        const existingFiles = await this.client.list();
        const existingFileNames = new Set(existingFiles.map(file => file.name));
        await this.client.cd(curPath);

        // 고유한 이름을 찾을 때까지 반복
        while (existingFileNames.has(uniqueName)) {
            uniqueName = `${base}(${count})${ext}`;
            count += 1;
        }

        return uniqueName;
    }

    // 타임아웃 리셋 메서드: 연결 시 매번 타임아웃을 초기화
    resetTimeout() {
        this.clearTimeout();
        this.timeout = setTimeout(() => {
            this.close();
        }, this.idleTime);
    }

    // 기존 타임아웃 제거
    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    // 3. FTP 연결 종료 메서드
    async close() {
        if (this.client && this.isConnected) {
            this.client.close();
            this.isConnected = false;
            console.log("FTP 연결이 종료되었습니다.");
        }
        this.clearTimeout();
    }

}

// export default FtpClient;
module.exports = FtpClient;