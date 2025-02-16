import fs from 'fs';
import { Worker, WorkerOptions } from 'worker_threads';
import { log, error } from '@repo/kwe-lib/components/logHelper';
import { sleep } from '@repo/kwe-lib/components/sleep';
import path from "path";
import { arp }  from '@repo/kwe-lib'

import dotenv from 'dotenv';
dotenv.config();

// const root = path.resolve(arp, '../') // the parent of the root path
const root = arp + '/apps/batch/components/worker';
const ufs_worker_director = root + '/ufs';
const mailing_worker_director = root + '/mailing';
const APPLE_EDI_WORKER_DIR = root + '/appleEDI';
const EXCHANGE_RATE_WORKER_DIR = root + '/exchange-rate';
const TMS_INTERFACE_WORKER_DIR = root + '/dataInterface';

let _arrThread:any = [];

function init() {
  //개발서버에서는 /dist까지 나와서 임시로 아래와 같이 설정 - stephen
  let root = process.cwd();
  if (root.endsWith("/dist")) root = root.replace("/dist", "");

  let filePath = root + '/dist/configs/thread.ini';
  console.log("filePath", filePath)
  try {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    //fileContent = fileContent.replaceAll('\r', '');
    let separator = process.platform === 'linux' ? '\n' : '\r\n';
    let lines = fileContent.split(separator); // 파일 내용을 라인별로 나눠 배열로 저장
    // lines.forEach((line, index) => {
    //   // 각 라인에 대한 처리를 여기에 작성
    // });

    //중복제거
    // const set = new Set(lines);
    // const uniqueArr = [...set];
    // _arrThread = uniqueArr;
    
    //_arrThread = lines
 
    for (const line of lines) {
      const arr = line.split(' ');
      _arrThread.push({idx: arr[0], pgm : arr[1], type:arr[2], headless:arr[3], terminal:arr[4]});
    }
    log(process.platform, _arrThread);
  } catch (error) {
    log('Error reading the file:', error);
  }
 
}

async function startWorker() {
  try {
    let i = 1;
    
    for (const thread of _arrThread) {
      // log("log시작:", thread.headless.toLowerCase() == 'true', _arrThread);
      // let worker;
      switch (thread.pgm) {
        case "SCRAP_UFSP_HBL":
        case "SCRAP_UFSP_HBL_OP":
        case "SCRAP_UFSP_MBL":
        case "SCRAP_UFSP_MBL_OP":
        case "SCRAP_TEST":
          const workerScrap = new Worker(ufs_worker_director + '/worker-ufsp-scraping.js'
                , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'true' ? true : false 
              }});

            break;

        //대상데이터 분배 처리 쓰레드
        //DeadLock 발생으로 추가
        case "SCRAP_UFSP":
          const workerDist = new Worker(ufs_worker_director + '/worker-data-distributor.js'
              , { workerData: { threadList : _arrThread, idx: thread.idx, pgm:thread.pgm }});
          break;
        case "SCRAP_UFSP_CHARGE_UPLOAD":
          const workerCharge = new Worker(ufs_worker_director + '/worker-ufsp-charge-uploader.js'
                , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'false' ? false : true
              }});
          break;
        case "SCRAP_UFSP_PROFILE_CARRIER":
            const workerCarrier = new Worker(ufs_worker_director + '/worker-ufsp-scraping-profile-carrier.js'
                , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
                }});
            break;
        case "SCRAP_UFSP_PROFILE_CUSTOMER":
            const workerCustomer = new Worker(ufs_worker_director + '/worker-ufsp-scraping-profile-customer.js'
                , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
                }});
            break;
        case "SCRAP_UFSP_PROFILE_PORT":
          const workerPort = new Worker(ufs_worker_director + '/worker-ufsp-scraping-profile-port.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
              }});
          break;          
        case "SCRAP_UFSP_CODE_MASTER":
          const workerCodeMaster = new Worker(ufs_worker_director + '/worker-ufsp-scraping-codemaster.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
              }});
          break;  
        case "SCRAP_UFSP_INVOICING_UPLOAD":
          const workerInvoicing = new Worker(ufs_worker_director + '/worker-ufsp-invoicing.js'
          , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
          }});
          break;  
        case "SCRAP_UFSP_PROFILE_CHARGE":
          const workerProfileCharge = new Worker(ufs_worker_director + '/worker-ufsp-scraping-profile-chargecode.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
              }});
          break;
        case "INSERT_UFSP_MILESTONE":
          const workerMilestone = new Worker(ufs_worker_director + '/worker-ufsp-milestone/milestone.js'
            , { workerData: { idx: thread.idx, pgm:thread.pgm, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
            }});
          break;
        case "BATCH_MAILING":
          const workerMailing = new Worker(mailing_worker_director + '/worker-mailing.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
              }});
          break;
        case "APPLE_EDI_810":
            const workerAppleEDI810 = new Worker(APPLE_EDI_WORKER_DIR + '/810.js', {workerData: { idx: thread.idx, pgm:thread.pgm}});
            break;
        case "APPLE_EDI_858":
          const workerAppleEDI858 = new Worker(APPLE_EDI_WORKER_DIR + '/858.js', {workerData: { idx: thread.idx, pgm:thread.pgm}});
          break;
        case "BATCH_HOLIDAY":
            const workerHoliday = new Worker(arp +"/apps/batch/components/worker/holiday" + '/holiday.js', {workerData: { idx: thread.idx, pgm:thread.pgm}});
            break;
        case "EXCHANGE_RATE":
            const workerExchangeRate = new Worker(EXCHANGE_RATE_WORKER_DIR + '/exchange-rate.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
              }});
            break;
        case "TMS_DATA_INTERFACE":
          const workerTMSDataInterface = new Worker(TMS_INTERFACE_WORKER_DIR + '/tms.js', {workerData: { idx: thread.idx, pgm:thread.pgm}});
          break;
        case "SCRAP_UFSP_CONFIRM_INVOICE_UPLOAD":
          const workerInvoiceConfirm = new Worker(ufs_worker_director + '/worker-ufsp-invoice-confirm.js'
            , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
            }});
          break;  

      }
      await sleep(2000);
      i++;
    }
  } catch (ex) {
    console.log(ex);
  }
}

init();
startWorker();
