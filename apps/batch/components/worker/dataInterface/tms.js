const { workerData } = require('worker_threads');
const { Readable } = require('stream');
const Library = require('../../ufspLibrary/ufsLibray');
const ufsp = new Library(workerData);
const  { configClass }  = require('../../helpers');
const config = new configClass();

const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction, executeKREAMFunction, executeTMSFunction } = require('../../api.service/api.service.js');

const pgm = workerData.pgm;
const idx = workerData.idx;

const excuteState = {
    onExcute: false
};

/*
 * TMS DB 운송데이터 -> KREAM DB 
1. KREAM에서 최근 연동 데이터 시간 조회
2. 1의 시간 기준 OperateDate 조건으로 TMS 연동 데이터 조회
3. 2의 데이터 KREAM DB에 insert
4. insert 한 max OperateDate 1에 저장
5. 1부터 반복
 */

async function setConfig() {
    try {

        const inparam = ['in_user', 'in_ipaddr'];
        const invalue = [pgm, ''];
        const inproc = 'batch.f_datainterface_load'; 
        const result = await executeKREAMFunction({inproc, inparam, invalue});

        return result[0].data[0];
        
    } catch (ex) {
        throw ex;
    }
}

// const setEDI858SendFlag = async (waybills, invoices, completed_tms, send_yn) => {
//     try {
//         const inparam = ['in_waybills', 'in_invoices', 'in_complete_tms', 'in_send_yn', 'in_user', 'in_ipaddr'];
//         const invalue = [waybills, invoices, completed_tms, send_yn, pgm, ''];
//         const inproc = 'airimp.f_airi3001_set_edi858_send_flag'; 
//         const result = await executFunction({inproc, inparam, invalue});
//     }
//     catch (ex) {
//         error("setEDI858SendFlag", ex);
//     }
// }

const getTMSData = async (last_interface_tm) => {
    try {
        const inparam = ['in_last_interface_tm', 'in_user', 'in_ipaddr'];
        const invalue = [last_interface_tm, pgm, ''];
        const inproc = 'epod_test.SP_DATAINTERFACE_TO_KREAM'; 
        const result = await executeTMSFunction({inproc, inparam, invalue});
        // log("getTMSData", last_interface_tm, result[0].data)
        return result[0].data;
    }
    catch (ex) {
        error("getTMSData", ex);
    }
}

async function setTMSDataToKREAM(tmsdata) {

    try {
        const inparam = ['in_jsondata', 'in_user', 'in_ipaddr'];
        const invalue = [JSON.stringify(tmsdata), pgm, ''];
        const inproc = 'batch.f_datainterface_set_tms_data'; 
        const result = await executeKREAMFunction({inproc, inparam, invalue});

        // log("setTMSDataToKREAM", JSON.stringify(tmsdata), result)
    } catch (error) {
        console.error("오류 발생:", error);
    } finally {
        
    }
}

const startTMSDataInterface = async () => {
    try {
        
        log("startTMSDataInterface 실행", excuteState.onExcute, new Date(), config.currentInterval)

        const { last_interface_tm, interval } = await setConfig();

        if (interval && interval !== config.currentInterval) {
            config.updateInterval(interval);
        }

        const tmsDatas = await getTMSData(last_interface_tm);
        
        await setTMSDataToKREAM(tmsDatas);


        // await makeEDI858FileToFTP();

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
    const proxyFn = config.registerProxyFunction(startTMSDataInterface, excuteState);
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