const { workerData } = require('worker_threads');
const { Readable } = require('stream');
const Library = require('../../ufspLibrary/ufsLibray');
const ufsp = new Library(workerData);
const  { configClass }  = require('../../helpers');
const config = new configClass("InvoiceConfirm");

const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction, executeKREAMFunction, executeTMSFunction } = require('../../api.service/api.service.js');

const pgm = workerData.pgm;
const idx = workerData.idx;

const excuteState = {
    onExcute: false
};

/*
 * UFS+ 인보이스 컨펌
    1. 인보이스로 키(id) 조회
    2. 키로 인보이스 데이터 조회
    3. 인보이스 컨펌
    4. 마일스톤 생성(import processing charges billed)
 */

async function setConfig() {
    try {

        const inparam = ['in_user', 'in_ipaddr'];
        const invalue = [pgm, ''];
        const inproc = 'scrap.f_scrp0012_load'; 
        const result = await executeKREAMFunction({inproc, inparam, invalue});

        return result[0].data[0];
        
    } catch (ex) {
        throw ex;
    }
}

const startInvoiceConfirm = async () => {
    try {
        
        log("startInvoiceConfirm 실행", excuteState.onExcute, new Date(), config.currentInterval)

        const { interval } = await setConfig();

        if (interval && interval !== config.currentInterval) {
            config.updateInterval(interval);
        }

        ufsp.mainData = null;
        const datas = await ufsp.getIFData();
        let script;

        if (datas.length > 0) {
            script = await ufsp.getScript();
        }

        for (const data of datas) {
            /***************
             * data
             * 1) pgm_code
             * 2) blno
             * 3) create_date
             * 4) updload_data - file_contents
             */
            ufsp.resultData = {};
            ufsp.mainData = data;
            // log("ufsp.mainData", ufsp.mainData);

            await ufsp.loginByApi(data.id)
                    .catch(async ex => {
                        log("loginByApi catch", JSON.stringify(ex))
                        throw ex;
                    });

            Object.keys(data).forEach(async function(key) {
                await ufsp.addJsonResult(data.tab, key, data[key], '');
            });

            await ufsp.startScript(script);
            const err_msg = (ufsp.resultData.warning ? ufsp.resultData.warning : '') 
                                + (ufsp.resultData.error ? ufsp.resultData.error : '');
            let if_yn = 'Y';
            if (err_msg) {
                if_yn = 'R';
            }

            // log(ufsp.idx, "----------------------Finish-----------------------", ufsp.mainData.bl_no, ufsp.resultData, err_msg);

            await ufsp.setBLIFData(if_yn, '', err_msg);

        }


        // await makeEDI858FileToFTP();

    } catch (ex) {
        /**
         * @dev
         * ^ 에러 발생 시 return.
         */
        error(ex);
        await ufsp.setBLIFData('R', '', JSON.stringify(ex));
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
    const proxyFn = config.registerProxyFunction(startInvoiceConfirm, excuteState);
    proxyFn();
    config.setBatchInterval(proxyFn);
    
    /**
     * @dev
     * 에러 전역 핸들러 등록.
     */
    Object.entries(config.commonProcessHandler).forEach(([eventName, handler]) => {
        const addCloseUFSP = async (...args) => {
            await ufsp.close();
            handler(...args);
        };
        process.on(eventName, addCloseUFSP);
    });
} catch (ex) {
    error(ex);
}