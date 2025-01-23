const { workerData } = require('worker_threads');
const { Readable } = require('stream');
const Library = require('../../ufspLibrary/ufsLibray');
const FtpClient = require('../../ftp/ftpClient');
const ufsp = new Library(workerData);
// const { config, common } = require('../../helpers');
const  {configClass}  = require('../../helpers');
const config = new configClass();

const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../../api.service/api.service.js');


let ftpPath = {};
const pgm = workerData.pgm;
const idx = workerData.idx;
let ftpClient;


const excuteState = {
    onExcute: false
};

async function setConfig() {
    try {

        const inparam = ['in_user', 'in_ipaddr'];
        const invalue = [pgm, ''];
        const inproc = 'airimp.f_airi3001_load'; 
        const result = await executFunction(inproc, inparam, invalue);

        const ftpinfo = result[5].data[0];
        const ftpConfig = {
            host: ftpinfo.ftp_url,
            user: ftpinfo.id,
            password: ftpinfo.pw,
            secure: false,
            secureOptions: undefined // 필요 시 설정
        }

        if (ftpinfo.interval && ftpinfo.interval !== config.currentInterval) {
            config.updateInterval(ftpinfo.interval);
        }
        
        ftpPath = {
            targetPath: ftpinfo.target_path, // /858FF/
        }
        
        ftpClient = new FtpClient(ftpConfig);
        
    } catch (ex) {
        throw ex;
    }
}

const setEDI858SendFlag = async (waybills, invoices, completed_tms, send_yn) => {
    try {
        const inparam = ['in_waybills', 'in_invoices', 'in_complete_tms', 'in_send_yn', 'in_user', 'in_ipaddr'];
        const invalue = [waybills, invoices, completed_tms, send_yn, pgm, ''];
        const inproc = 'airimp.f_airi3001_set_edi858_send_flag'; 
        const result = await executFunction(inproc, inparam, invalue);
    }
    catch (ex) {
        error("setEDI858SendFlag", ex);
    }
}

const getEDI858ReadyData = async () => {
    try {
        const inparam = ['in_user', 'in_ipaddr'];
        const invalue = [pgm, ''];
        const inproc = 'airimp.f_airi3001_get_edi858_data'; 
        const result = await executFunction(inproc, inparam, invalue);

        return result[0].data;
    }
    catch (ex) {
        error("getEDI858ReadyData", ex);
    }
}

async function makeEDI858FileToFTP() {

    try {
        await ftpClient.connect();
        const datas = await getEDI858ReadyData();
        
        let completeWaybills = [];
        let completeInvoices = [];
        let completeTimes = [];
        for (const data of datas) {
            const { file_nm, complete_tm, contents, waybill_no, invoice_no } = data;
            const stream = Readable.from([contents], { encoding: 'utf8' });
            await ftpClient.uploadFile(stream, ftpPath.targetPath + file_nm);

            completeWaybills.push(waybill_no);
            completeInvoices.push(invoice_no);
            completeTimes.push(complete_tm);
        }
        
        if (completeWaybills.length > 0) {
            // log("completeWaybills",completeWaybills)
            const waybills = completeWaybills.join(' ');
            const invoices = completeInvoices.join(' ');
            const completed_tms = completeTimes.join(' ');
            await setEDI858SendFlag(waybills, invoices, completed_tms, 'Y');
        }
        
    } catch (error) {
        console.error("오류 발생:", error);
    } finally {
        // log("finally================================");
        if (ftpClient && ftpClient.isConnected) await ftpClient.close();
    }
}

const startAppleEdi858 = async () => {
    try {
        
        log("startInsertExchangeRateData 실행", excuteState.onExcute, new Date(), config.currentInterval)
        await setConfig();
        await makeEDI858FileToFTP();

    } catch (ex) {
        /**
         * @dev
         * ^ 에러 발생 시 return.
         */
        error(ex);
        return;
    }
};

try {
    /**
     * @dev
     * Proxy 함수 설정 및 interval 무한 반복 시작.
     * [ Details ]
     * 배치 서버 최초 실행 시 Proxy 함수 즉시 실행.
     */
    const proxyFn = config.registerProxyFunction(startAppleEdi858, excuteState);
    proxyFn();
    config.setBatchInterval(proxyFn);
    
    /**
     * @dev
     * 에러 전역 핸들러 등록.
     */
    Object.entries(config.commonProcessHandler).forEach(([eventName, handler]) => {
        // const addCloseUFSP = async (...args) => {
        //     await ufsp.close();
        //     handler(...args);
        // };
        // process.on(eventName, addCloseUFSP);
    });
} catch (ex) {
    error(ex);
}