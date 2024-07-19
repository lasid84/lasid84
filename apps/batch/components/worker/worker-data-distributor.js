// import { workerData } from 'worker_threads';
// import { executFunction } from './api.service.ts';
// import { log, error } from '@repo/kwe-lib/components/logHelper';

const { workerData } = require('worker_threads');
const  puppeteer = require('puppeteer');
const { executFunction } = require('../api.service/api.service');
const { log, error } = require('@repo/kwe-lib/components/logHelper');

const { pgm, type, idx, isHeadless } = workerData;
let onExcute = false;

async function setIFDataInit() {
    try {
        const inparam = ["in_pgm_code", 'in_idx', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, '', ''];
        const inproc = 'scrap.f_scrp0001_set_init_if_data2'; 
        const result = await executFunction(inproc, inparam, invalue);
        error(result);
 
    } catch (ex) {
        throw ex;
    } finally {
    }
}

async function setIFDataDistribute() {
    try {
        onExcute = true;

        const inparam = ['in_threads', 'in_user_id', 'in_ipaddr'];
        const invalue = [JSON.stringify(workerData), '', ''];
        const inproc = 'scrap.f_scrp0001_set_if_data_dist'; 
        await executFunction(inproc, inparam, invalue);
 
    } catch (ex) {
        throw ex;
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
            console.log("mySetInterval", ex)
            onExcute = false;
        }
    }, 10000)};


try {
    log("worker.js시작");
    // setInitBLIFData(); //데이터 분배 스레드 추가로 사용 안함(worker-data-distributor.js)
    startScraping();
    mySetInterval();

    // 프로세스 종료 시 브라우저 닫기
    process.on('SIGINT', async () => {
        console.log('SIGINT signal received.');
        await ufsp.close();
    });

    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received.');
        await ufsp.close();
    });

    process.on('exit', async () => {
        console.log('Process exit event received.');
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