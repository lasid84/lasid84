import fs from 'fs';
import { Worker, WorkerOptions } from 'worker_threads';
import { log, error } from '@repo/kwe-lib/components/logHelper';
import { sleep } from '@repo/kwe-lib/components/sleep';
import path from "path";
import { arp }  from '@repo/kwe-lib'

// const root = path.resolve(arp, '../') // the parent of the root path

let _arrThread:any = [];

function init() {
  
  let filePath = process.cwd() + 'dist/configs/thread.ini';
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
  let i = 1;
  log("arrThread", JSON.stringify(_arrThread));
  for (const thread of _arrThread) {
    // log("log시작:", thread.headless.toLowerCase() == 'true', _arrThread);
    // let worker;
    switch (thread.pgm) {
      case "SCRAP_UFSP_HBL":
      case "SCRAP_UFSP_HBL_OP":
      case "SCRAP_UFSP_MBL":
      case "SCRAP_UFSP_MBL_OP":
      case "SCRAP_TEST":
        const workerScrap = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-scraping.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'true' ? true : false 
            }});

          break;

      //대상데이터 분배 처리 쓰레드
      //DeadLock 발생으로 추가
      case "SCRAP_UFSP":
        const workerDist = new Worker(arp + '/apps/batch/components/worker/worker-data-distributor.js'
            , { workerData: { threadList : _arrThread, idx: thread.idx, pgm:thread.pgm }});
        break;
      case "SCRAP_UFSP_CHARGE_UPLOAD":
        const workerCharge = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-charge-uploader.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'false' ? false : true
            }});
        break;
      case "SCRAP_UFSP_PROFILE_CARRIER":
          const workerCarrier = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-scraping-profile-carrier.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
              }});
          break;
      case "SCRAP_UFSP_PROFILE_CUSTOMER":
          const workerCustomer = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-scraping-profile-customer.js'
              , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true
              }});
          break;
      case "SCRAP_UFSP_PROFILE_PORT":
        const workerPort = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-scraping-profile-port.js'
            , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
            }});
        break;          
      case "SCRAP_UFSP_CODE_MASTER":
        const workerCodeMaster = new Worker(arp + '/apps/batch/components/worker/worker-ufsp-scraping-codemaster.js'
            , { workerData: { idx: thread.idx, pgm:thread.pgm, isHeadless:thread.headless?.toLowerCase() == 'false' ? false : true 
            }});
        break;  
    }
    await sleep(3000);
    i++;
  }
}

init();
startWorker();
