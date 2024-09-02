
const { workerData } = require('worker_threads'); 
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const Library = require('../../ufspLibrary/ufsLibray');

const ufsp = new Library(workerData);

let onExcute = false;
var x_date;

async function setCodeMasterData() {
    try {

        const inparam = ['in_data', 'in_user', 'in_ipaddr'];
        const invalue = [JSON.stringify(ufsp.resultData),'scrap_codemaster', ''];
        const inproc = 'scrap.f_scrp0007_set_codemaster_data'; 
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

        const koreaTime = getKoreaTime(); 
        const date = koreaTime.getUTCDate();
        const hours = koreaTime.getUTCHours();
        const minutes = koreaTime.getUTCMinutes();
        

        if (x_date != date && hours === 12 && minutes === 10) {
            await ufsp.insertIFData('X');
            x_date = date;
            // log("in if", koreaTime, date, hours, minutes);
        }
        
        const datas = await ufsp.getIFData();
        let script;
        if (datas.length > 0) {
            script = await ufsp.getScript(this.pgm);
        }

        for (const data of datas) {
            /***************
             * data
             * 1) pgm_code
             * 2) blno
             * 3) create_date
             * 4) updload_data - file_contents
             */

            await ufsp.loginByApi('', true);

            ufsp.resultData = {};
            ufsp.mainData = data;
            
            await Object.keys(data).forEach(async function(key) {
                await ufsp.addJsonResult(data.tab, key, data[key], '');
            });
            // log("for ", data, script);
            await ufsp.startScript(script);

            log(ufsp.idx, "----------------------Finish-----------------------", ufsp.mainData.bl_no, ufsp.resultData);
            await setCodeMasterData();
            // await ufsp.setBLIFData('Y', '', '');     
            await ufsp.setBLIFData('Y', '', '');       
            ufsp.errCnt = 0;
            ufsp.lastExcute = getKoreaTime();
        }

    }
    catch(ex) {
        if (ufsp.mainData) {
            if (ufsp.mainData.error) ufsp.setBLIFData('R', '', ufsp.mainData.error);
            else await ufsp.setBLIFData('R', '', ex);
        }    
        error(this.idx, ": Parent Ex :", ex);
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