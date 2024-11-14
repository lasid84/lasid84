
const { workerData } = require('worker_threads'); 
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction, insertDBAlertLog } = require('../../api.service/api.service.js');
const { getCall  } = require('@repo/kwe-lib/components/api.service');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const { sleep } = require('@repo/kwe-lib/components/sleep.js');

let onExcute = false;
var x_date;
const interval = 1 * 30 * 1000;

const { pgm, type, idx, isHeadless } = workerData;

async function getScript() {
    
    const inparam = ['in_pgm_code', 'in_user', 'in_ipaddr'];
    const invalue = [pgm, pgm, ''];
    const inproc = 'scrap.f_scrp1001_load'; 
    const cursorData = await executFunction(inproc, inparam, invalue);

    return cursorData[0].data;
}

async function getIFData() {
    try {
        
        // log("Start Script");
        const inparam = ['in_pgm_code', 'in_idx', 'in_type', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, type, '', ''];
        const inproc = 'scrap.f_scrp0001_get_if_scrap2'; 
        const cursorData = await executFunction(inproc, inparam, invalue);

        return cursorData[0].data;
        
    } catch (ex) {
        log("ex:", ex)
    }
}

async function insertIFData(key = '') {
    try {    

        const inparam = ['in_pgm_code', 'in_blno', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, key, pgm, ''];
        const inproc = 'scrap.f_scrp0001_ins_if_data'; 
        await executFunction(inproc, inparam, invalue);
        //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
        
    } catch (ex) {
        throw ex;
    }
}

async function setBLIFData(key, create_date, if_yn, result, err_msg) {
    try {
        
        const inparam = ['in_pgm_code', 'in_idx', 'in_blno', 'in_create_date', 'in_if_yn','in_result', 'in_err', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, key, create_date, if_yn, result, err_msg, pgm, ''];
        const inproc = 'scrap.f_scrp0001_set_if_data'; 
        await executFunction(inproc, inparam, invalue);
        //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
        
    } catch (ex) {
        throw ex;
    }
}

async function setDayInfo(jsonData) {
    try {
        
        const inparam = ['in_jsondata', 'in_user', 'in_ipaddr'];
        const invalue = [JSON.stringify(jsonData), pgm, ''];
        const inproc = 'scrap.f_scrp1001_set_dayinfo'; 
        const result = await executFunction(inproc, inparam, invalue);
        // return cursorData[0].data;
        return result;
    } catch (ex) {
    }
}

async function getDayInfo() {

    try {
        onExcute = true;

        const koreaTime = getKoreaTime(); 
        const date = koreaTime.getUTCDate();
        const hours = koreaTime.getUTCHours();
        const minutes = koreaTime.getUTCMinutes();
        
        if (x_date != date && hours === 12 && minutes === 20) {
            await insertIFData('X');
            x_date = date;
        }
        
        const datas = await getIFData();

        if (!datas.length) return;

        for (const data of datas) {
            const scripts = await getScript();
            for (const script of scripts) {
                const param = {
                    // url: "https://m.search.naver.com/p/csearch/content/qapirender.nhn?where=nexearch&key=CalendarAnniversary&pkid=134&q=202405월"
                    url: script.url
                }
            
                const result = await getCall(param);
                setDayInfo(result.data);

                sleep(1000);
            }

            await setBLIFData('X', data.create_date, 'Y', '', ''); 
        }
        
    }
    catch(ex) {
        log("worker getDayInfo ex : ", ex);
        insertDBAlertLog(pgm, ex.toString(), '');
    } finally {
        onExcute = false;
    }
}

const setInterval = async () => {
    setTimeout(() => {
        try {
            if (!onExcute) {
                getDayInfo();
            }
            setInterval();
        } catch (ex) {
            log("mySetInterval", ex)
        }
    }, interval)};

try {
    log("Holiday worker.js시작");

    getDayInfo();
    setInterval();

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