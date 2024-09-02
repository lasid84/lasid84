

const { workerData } = require('worker_threads'); 
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const Library = require('../../ufspLibrary/ufsLibray');

const ufsp = new Library(workerData);

let onExcute = false;

const getInvoicingData = async (inv_group, createtype) => {
    
    const inparam = ['in_inv_group', 'in_createtype', 'in_user', 'in_ipaddr'];
    const invalue = [inv_group, createtype, '',''];
    const inproc = 'scrap.f_scrp0008_get_invoicing_data'; 
    const cursorData = await executFunction(inproc, inparam, invalue);

    return cursorData[0].data;
}

const setInvoicingIFData = async () => {
    try {
            var remark = ufsp.resultData.warning ? this.resultData.warning : '';
        let inv_group = ufsp.resultData.t_hbl_charge_if.inv_group;
        let invoice_no = ufsp.resultData.invoice[1];
        const inparam = ['in_inv_group', 'in_invoice_no', 'in_user', 'in_ipaddr'];
        const invalue = [inv_group, invoice_no, '', ''];
        const inproc = 'scrap.f_scrp0008_set_if_invoiced_data'; 
        await executFunction(inproc, inparam, invalue);
        log("setInvoicingIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", invalue) ;
        
    } catch (ex) {
        throw ex;
    }
}

async function startScraping() {

    try {
        onExcute = true;
        ufsp.mainData = null;
        const datas = await ufsp.getIFData();

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

            await ufsp.loginByApi(data.id);
            
            await Object.keys(data).forEach(async function(key) {
                await ufsp.addJsonResult(data.tab, key, data[key], '');
            });

            let uploadData = await getInvoicingData(ufsp.mainData.keydata, '');

            if (!uploadData.length) continue;
            
            for (const dataItem of uploadData) {
                //미처리된 차지코드 존재 시 대기(업무부와 협의 필요)
                if (dataItem.delay_cnt > 0) continue;

                await ufsp.addJsonResult('t_hbl_charge_if', '', '', dataItem, 'addBulk');
                let script = await ufsp.getScript();
                await ufsp.startScript(script);
                await setInvoicingIFData();
                await ufsp.setBLIFData('Y', '', '');
                log(ufsp.idx, "----------------------Finish-----------------------", ufsp.mainData.bl_no, JSON.stringify(ufsp.resultData));
            }

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