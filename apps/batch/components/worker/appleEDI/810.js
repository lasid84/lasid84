
const { workerData } = require('worker_threads'); 
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const FtpClient = require('../../ftp/ftpClient');

let interval = 5 * 60 * 1000;
let onExcute = false;
let ftpPath = {};
const pgm = workerData.pgm;
const idx = workerData.idx;

async function setConfig() {
    try {

        const inparam = ['in_user', 'in_ipaddr'];
        const invalue = ['EDI810', ''];
        const inproc = 'airimp.f_airi3001_load'; 
        const result = await executFunction(inproc, inparam, invalue);

        const ftpinfo = result[0].data[0];
    
        const ftpConfig = {
            host: ftpinfo.ftp_url,
            user: ftpinfo.id,
            password: ftpinfo.pw,
        }

        if (ftpinfo.interval) interval = ftpinfo.interval;
        
        ftpPath = {
            targetPath: ftpinfo.target_path, // /810FF_KREAM/
            completedPath: ftpinfo.completed_path, // /810FF_KREAM/Completed/
        }
        
        ftpClient = new FtpClient(ftpConfig);
        
    } catch (ex) {
        throw ex;
    }
}

async function insertEDI810Data(jsonData) {
    try {

        const inparam = ['in_jsondata', 'in_user', 'in_ipaddr'];
        const invalue = [JSON.stringify(jsonData), pgm, ''];
        const inproc = 'airimp.f_airi3001_ins_edi810'; 
        const result = await executFunction(inproc, inparam, invalue);

    } catch (ex) {
        throw ex;
    }
}

async function setEDI810Data() {
    try {

        const inparam = ['in_pgm_code', 'in_user', 'in_ipaddr'];
        const invalue = [pgm, pgm, ''];
        const inproc = 'airimp.f_airi3001_set_edi810'; 
        const result = await executFunction(inproc, inparam, invalue);

    } catch (ex) {
        throw ex;
    }
}

async function insert810FTPFile() {

    onExcute = true;

    try {
        await ftpClient.connect();

        // 파일 읽기
        const files = await ftpClient.readAllFilesInFolder(ftpPath.targetPath);
        
        const filesContent = [];
        for (const file of files) {
            if (file.isFile) { // 파일인 경우에만 처리
                if (!file.name.trim().startsWith("APPLE_810")) continue;

                const uniquefileName = await ftpClient.donwloadFile(ftpPath.targetPath, file.name);
                const fileContent = await ftpClient.readFile(uniquefileName);
                filesContent.push({ fileName: file.name, content: fileContent });
                
                const uniqueRemotefileName = await ftpClient.getUniqueRemoteFileName(ftpPath.completedPath, file.name);
                const isSuccess = await ftpClient.uploadFile(uniquefileName, ftpPath.completedPath + "/" + uniqueRemotefileName)
                
                if (isSuccess) {
                    await ftpClient.removeLocalFile(uniquefileName); //로컬파일
                    await ftpClient.removeFile(ftpPath.targetPath + "/" + file.name); //리모트파일
                }      
            }
        }
        
        insertEDI810Data(filesContent);
        
        // 파일 이동
        // await ftpClient.moveFile("/sourceFolder/sample.txt", "/destinationFolder/sample.txt");
    } catch (error) {
        console.error("오류 발생:", error);
    } finally {
        await ftpClient.close();
        onExcute = false;
    }
}

const setInterval = () => {
    setTimeout(() => {
        try {
            if (!onExcute) {
                log("========start APPLE EDI 810")
                insert810FTPFile();
                setEDI810Data();
            }
            setInterval();
        } catch (ex) {
            log("mySetInterval", ex)
        }
    }, interval)};


try {
    setConfig().then(() => {
        insert810FTPFile();
        setEDI810Data();
        setInterval();
    });    

    // 프로세스 종료 시 브라우저 닫기
    process.on('SIGINT', async () => {
        log('SIGINT signal received.');
        await ufsp.close();
    });

    process.on('SIGTERM', async () => {
        log('SIGTERM signal received.');
        await ufsp.close();
    });

    process.on('exit', async () => {
        log('Process exit event received.');
        await ufsp.close();
    });

    // 예기치 않은 오류 처리
    process.on('uncaughtException', async (err) => {
        error('Uncaught Exception:', err);
        await ufsp.close();
    });

    process.on('unhandledRejection', async (reason, promise) => {
        error('Unhandled Rejection:', reason);
        await ufsp.close();
    });
} catch (ex) {
    //log처리 추가
    error(ex);
}