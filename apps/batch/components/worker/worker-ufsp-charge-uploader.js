/*
 * To Do
   1) 계정 비번 만료 시 처리 기능(유저별 메일 발송 or 등등등)
   2) 리팩토링
*/ 

// import { workerData } from 'worker_threads'; 
// import  puppeteer from 'puppeteer';
// import { log, error } from '@repo/kwe-lib/components/logHelper.js';
// import { executFunction } from './api.service.ts';
// import { getKoreaTime } from '@repo/kwe-lib/components/dataFormatter.js';
// // import Library from '../lib/ufsLibray.ts';
// import Library from './lib/ufsLibray.ts';



const { workerData } = require('worker_threads'); 
const  puppeteer = require('puppeteer');
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { executFunction } = require('../api.service/api.service.js');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const Library = require('../ufspLibrary/ufsLibray');

const ufsp = new Library(workerData);

let onExcute = false;

async function startScraping() {

    try {
        onExcute = true;
        ufsp.mainData = null;

        // const now = getKoreaTime(); 
        // const hours = now.getHours();
        // const minutes = now.getMinutes();       

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

        
        const datas = await ufsp.getIFData();
        let script;

        // log("1 - ", ufsp.idx, datas.length);
        if (datas.length > 0) {
            // if (datas[0].needlogin.toLowerCase() == 't') {
            //     await ufsp.checkSession();
            // }
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
            ufsp.resultData = {};
            ufsp.mainData = data;
            log("ufsp.mainData", ufsp.mainData);

            await ufsp.loginByApi(data.id);
            
            // await addJsonResult(data.tab, 'bl_no', data.bl_no, '');
            // await addJsonResult(data.tab, 'trans_type', type, '');

            await Object.keys(data).forEach(async function(key) {
                await ufsp.addJsonResult(data.tab, key, data[key], '');
            });

            let uploadData = await ufsp.getChargeUploadData();

            if (!uploadData.length) continue;
            
            for (const dataItem of uploadData) {
                await ufsp.addJsonResult('t_hbl_charge_if', '', '', dataItem, 'addBulk');
                await ufsp.startScript(script);
                await ufsp.setChargeIFData();
            }

            log(ufsp.idx, "----------------------Finish-----------------------", ufsp.mainData.bl_no, ufsp.resultData);
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
        await library.close();
    });

    process.on('SIGTERM', async () => {
        log('SIGTERM signal received.');
        await library.close();
    });

    process.on('exit', async () => {
        log('Process exit event received.');
        await library.close();
    });

    // 예기치 않은 오류 처리
    process.on('uncaughtException', async (err) => {
        error('Uncaught Exception:', err);
        await library.close();
    });

    process.on('unhandledRejection', async (reason, promise) => {
        error('Unhandled Rejection:', reason);
        await library.close();
    });
} catch (ex) {
    //log처리 추가
    error(ex);
}