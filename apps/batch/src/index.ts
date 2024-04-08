const fs = require('fs');
import { Worker, WorkerOptions } from 'worker_threads';
// import { path, arp } from '@repo/kwe-lib';
import { log, error } from '@repo/kwe-lib/components/logHelper';
import { sleep } from '@repo/kwe-lib/components/sleep';
const path = require("path");
import { arp }  from '@repo/kwe-lib'

// const root = path.resolve(arp, '../') // the parent of the root path

let _arrThread:any = [];

function init() {

  // console.log(root);
  // console.log(arp);
  // return;
  let filePath = process.cwd() + '/dist/configs/thread.ini'; 
  error("filePath", filePath)
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
      _arrThread.push({idx: arr[0], pgm : arr[1], type:arr[2], headless:arr[3]})
    }
    log(process.platform, _arrThread);
  } catch (error) {
    log('Error reading the file:', error);
  }

}

async function startWorker() {
  let i = 1;
  for (const thread of _arrThread) {
    log("log시작:", thread.headless.toLowerCase() == 'true');
    // let worker;
    switch (thread.pgm) {
      case "SCRAP_UFSP_HBL":
      case "SCRAP_UFSP_MBL":
      case "SCRAP_UFSP_CONSOL":
      case "SCRAP_TEST":
      // const workerTs = (file: string, wkOpts: WorkerOptions & any) => {
      //   wkOpts.eval = true;
      //     if (!wkOpts.workerData) {
      //       wkOpts.workerData = {};
      //     }
        
      //     wkOpts.workerData.__filename = file;
      //     return new Worker(`
      //             const wk = require('worker_threads');
      //             require('ts-node').register({
      //               "compilerOptions": {
      //                 "target": "es2016",
      //                 "esModuleInterop": true,
      //                 "module": "commonjs",
      //                 "rootDir": ".",
      //               }
      //             });
      //             let file = wk.workerData.__filename;
      //             delete wk.workerData.__filename;
      //             require(file);
      //         `,
      //       wkOpts
      //     );
      //   };

      // const worker = workerTs('./src/worker.ts', { worderData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'true' ? true : false } });
        
      console.log(arp + '/apps/batch/src/worker-scraping.js');
      
      const worker = new Worker(arp + '/apps/batch/src/worker-scraping.js'
      // worker = new Worker('./components/workers/c.js'
            , { workerData: { idx: thread.idx, pgm:thread.pgm, type:thread.type, isHeadless:thread.headless.toLowerCase() == 'true' ? true : false 
          }});

        break;
    }
    
    await sleep(10000);
    i++;
  }
}

init();
startWorker();
