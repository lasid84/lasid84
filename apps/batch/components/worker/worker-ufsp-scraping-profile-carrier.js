
const { workerData } = require('worker_threads'); 
const  puppeteer = require('puppeteer');
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const Library = require('../ufspLibrary/ufsLibray');

const ufsp = new Library(workerData);

let onExcute = false;

async function setCarrierData() {
    try {

        const inparam = ['in_data', 'in_user_id', 'in_ipaddr'];
        const invalue = [JSON.stringify(ufsp.resultData),'', ''];
        const inproc = 'scrap.f_scrp0003_set_carrier_data'; 
        await executFunction(inproc, inparam, invalue);
        //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
        
    } catch (ex) {
        throw ex;
    }
}

async function startScraping() {

    try {
        onExcute = true;
        ufsp.mainData = null;

        // const now = getKoreaTime(); 
        // const hours = now.getUTCHours();
        // const minutes = now.getUTCMinutes();       

        // if (hours === 8 && minutes === 30) {
        //     if (!ufsp.lastExcute) {
        //         await ufsp.checkSession(true);
        //     } else {
        //         const diffMSec = now - ufsp.lastExcute.getTime();
        //         const diffMin = diffMSec / (60 * 1000);
        //         if (diffMin > 10) {
        //             await ufsp.checkSession(true);
        //         }
        //     }
        // }

        await ufsp.loginByApi('', false);

        const datas = await ufsp.getIFData();
        let script;

        if (datas.length > 0) {
            // if (datas[0].needlogin.toLowerCase() == 't') {
            //     await ufsp.checkSession();
            // }
            script = await ufsp.getScript(ufsp.pgm);
        }

        for (const data of datas) {
            /***************
             * data
             * 1) pgm_code
             * 2) keydata
             * 3) create_date
             */
            ufsp.resultData = {};
            ufsp.mainData = data;

            Object.keys(data).forEach(async function(key) {
                await ufsp.addJsonResult(data.tab, key, data[key], '');
            });

            await ufsp.startScript(script);
            log(ufsp.idx, "----------------------Finish-----------------------", ufsp.mainData.keydata, JSON.stringify(ufsp.resultData));
            await setCarrierData();
            await ufsp.setBLIFData('Y', '', '');
            ufsp.errCnt = 0;
            // lastExcute = new Date();
            ufsp.lastExcute = getKoreaTime();
            // log(JSON.stringify(resultData));
        }

    }
    catch(ex) {
        if (ufsp.mainData) {
            await ufsp.setBLIFData('R', '', ex);
        }    
        error(ufsp.idx, ": Parent Ex :", ex, ufsp.mainData);
        ufsp.errCnt++;
    } finally {
        onExcute = false;
    }
}

const mySetInterval = () => {
    setTimeout(() => {
        try {
            if (!onExcute) {
                log(ufsp.idx, "=================Restart==================")
                startScraping();
            }
            log("mySetInterval : ", onExcute);
            mySetInterval();
        } catch (ex) {
            log("mySetInterval", ex)
        }
    }, 10000)};


try {
    log("worker.js시작");
    // setInitBLIFData(); //데이터 분배 스레드 추가로 사용 안함(worker-data-distributor.js)
    startScraping();
    mySetInterval();

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