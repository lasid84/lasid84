
const { workerData } = require('worker_threads'); 
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction, sendEmail } = require('../../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');

let onExcute = false;

const { pgm, type, idx, isHeadless } = workerData;

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

async function getEmailData() {
    try {
        
        const inparam = ['in_pgm_code', 'in_idx', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, '', ''];
        const inproc = 'public.f_batch01_get_send4email2'; 
        const cursorData = await executFunction(inproc, inparam, invalue);

        return cursorData[0].data;
        
    } catch (ex) {
    }
}

async function startEmailBatch() {

    try {
        onExcute = true;
        const datas = await getEmailData();
        // log("==========", datas)
        if (datas.length) await sendEmail(datas);
        

    }
    catch(ex) {
        log("worker sendEmail ex : ", ex);
    } finally {
        onExcute = false;
    }
}

const mySetInterval = () => {
    setTimeout(() => {
        try {
            if (!onExcute) {
                startEmailBatch();
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
    startEmailBatch();
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