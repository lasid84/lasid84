const { workerData } = require('worker_threads');
const  puppeteer = require('puppeteer');
const { pgm, type, idx, isHeadless } = workerData;
const { executFunction } = require('./api.service.ts');

const { log, error } = require('@repo/kwe-lib/components/logHelper');


let onExcute = false;

async function setIFDataInit() {
    try {
        const inparam = ["in_pgm_code", 'in_idx', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, '', ''];
        const inproc = 'scrap.f_scrp0001_set_init_if_data2'; 
        await executFunction(inproc, inparam, invalue);
 
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
        if (!onExcute) {
            setIFDataDistribute();
        }
        log("mySetInterval : ", onExcute);
        mySetInterval();
        }, 5000);
    };


try {
    setIFDataInit();
    mySetInterval();
} catch (ex) {
    //log처리 추가
    error(ex);
}