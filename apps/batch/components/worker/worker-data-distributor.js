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