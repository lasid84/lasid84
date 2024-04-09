/*
 * To Do
   1) 계정 비번 만료 시 처리 기능(유저별 메일 발송 or 등등등)
   2) 리팩토링
*/ 




const { workerData } = require('worker_threads'); 
const  puppeteer = require('puppeteer');
const { pgm, type, idx, isHeadless } = workerData;

const { log, error } = require('@repo/kwe-lib/components/logHelper');
// import { sleep } from '@repo/kwe-lib/components/sleep';
// const { executFunction } = require('@repo/kwe-lib/components/api.service.js');
const { init, dataCall } = require('@repo/kwe-lib/components/api.service.js');
const { ini, objectPath, fs } = require("@repo/kwe-lib");
const { signJwtAccessToken } = require('@repo/kwe-lib/components/jsonWebToken.js');


let onExcute = false;
let browser;
let page;
let resultData = {};
let mainData;
let errCnt = 0;
let requestHeaders;
let header;
let lastExcute;
let isNeedLogin = false;

var iniData;
var url;
var token;

async function initService() {
    //batch 프로젝트는 process.cwd() : /home/sdd_it/kream_web/apps/batch/dist 임.. 왜 api랑 다른지 모르겠음
    iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    url = objectPath.get(iniData, "main.url");
    // error("initService", url, token, iniData);
}

async function startBrowser() {
    log(idx, "start Brower headless: ", isHeadless, errCnt);
    
    if (errCnt > 4) {
        if (browser) {
            await browser.close();
            browser = null;
            errCnt = 0;
        } else {
            log("brower null 아님");
        }
    }

    if (!browser) {
        log("brower restart")
        browser = await puppeteer.launch({ headless:isHeadless, 
        args:[ '--start-maximized' // you can also use '--start-fullscreen'
            ],
        defaultviewport: null,
    });
    }

    const pages = await browser.pages();
    page = pages[0];
    await page.setViewport({width: 0, height: 0});

    // page.on('dialog', async dialog => {
    //     await dialog.accept();
    //   });

    lastExcute = new Date();
};

async function executFunction(inproc, inparam, invalue) {
    token = signJwtAccessToken({user_id:"sdd_it", user_nm:"SDD"});
    const client = await init({url:url, isAuth:false, accessToken:token});
    
    const { cursorData, numericData, textData } = await dataCall(client, inproc,inparam, invalue,'');

    log("executFunction", url, inproc,inparam, invalue, numericData, textData, cursorData);
    if (numericData !== 0)
    {
        let errMsg = numericData + " : " +  textData;
      log(errMsg);
      throw new Error(errMsg);
    }

    return cursorData;
}

async function login() {

    try { 

        log("login");

        const inparam = ['in_pgm_code', 'in_idx', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, '', ''];
        const inproc = 'scrap.f_scrp0001_get_script'; 
        const cursorData = await executFunction(inproc, inparam, invalue);

        const acctInfo = cursorData[0].data;
        const scripts = cursorData[1].data;

        await page.setRequestInterception(true);
        page.on('request', (request) => {
          requestHeaders = request.headers();
        //   header = {};
        //   header['accept'] = requestHeaders.accept;
        //   header['content-type'] = 'application/json;charset=UTF-8';
        //   header['cookie'] = requestHeaders.cookie;
            header = requestHeaders;
            if (!header['content-type']) {
                header['content-type'] = 'application/json;charset=UTF-8';
            }
          request.continue();
        });
        
        for (const script of scripts) {
            switch (script.src_type.toLowerCase()) {
                case 'selector':
                    await callElement(script, acctInfo[0]);
                // await page.type('#inputEmail','ghlim5501');
                // await page.type('#inputPassword','1q2w#E$R');

                // await page.click('#loginForm > div:nth-child(5) > button');
                // await page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 60000})
            }
        }
        // await sleep(1000);

        let [cookies] = await page.cookies();

        //await page.setRequestInterception(false);

    } catch (ex) {
        log("ex_login:", ex)
        throw ex
    }
}

async function callElement(script, data) {
    
    switch(script.src_type) {
        // case "xpath":
        //     return await callElementXPath(data);
        case "selector":
            return await callElementSelector(script, data);
        // case "class":
        //     return await callElementClass(data);
        // default:
        //     return await callElementXPath(data);
    }
}

async function callElementSelector(script, data) {
    try {

        const label = idx + ":" + script.seq + "." + script.pgm_code + "." + script.action + "." + script.remark + "." + script.val1;  //+ "//////" + data.action + "_" + data.src1+ "_" +data.val1;
        let action = script.action;
        let src = script.src1;
        let val = data[script.val1] ? data[script.val1] : script.val1;

        switch (action) {
            case "goto":
                await Promise.all(
                    [page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 120000}), page.waitForNetworkIdle(),
                     page.goto(val, {
                        // ❸ 모든 네트워크 연결이 500ms 이상 유휴 상태가 될 때까지 기다림
                        waitUntil: ['networkidle0','domcontentloaded'],
                    })]);
                log("end goto");
                break;
            case "sleep":
                // await sleep(val);
                break;
            case "click":
                    //await Promise.all([page.waitForNetworkIdle(), page.$eval(src, element => element.click())]);
                    await Promise.all([page.$eval(src, element => element.click()), page.waitForNetworkIdle(), page.waitForRequest()]);
                break;
            case "click2":
                //await Promise.all([page.waitForNavigation({waitUntil: 'networkidle0', timeout: 30000}), page.waitForNetworkIdle(), page.$eval(`${src}`, element => element.click())]);
                await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 120000}), page.waitForNetworkIdle(), page.click(src)]);
                break;
            case "select":
                    page.select(src, val);
                    await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 600000});
            case "type":
                //await page.type(cssselector, value);
                await Promise.all([page.waitForNetworkIdle(), page.type(src, val)]);
                break;
            case "text":
                return await page.$$eval(
                    `${src}`, 
                    elements => elements.map(el => el.innerText));
            case "checkerr":
                const msg = await callElement("text", "custom-scrollbar msg-content");
                if (msg[0]) {
                    log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:",msg);
                    /**************************************************************/
                    /* msg 메일 발송 기능 추가
                    /**************************************************************/
                    // sleep(3600000);        
                }
                break;

        }
    } catch (err) {
        log(err);
    } finally {
        // await sleep(200);
    }
}

async function setInitBLIFData(pgm_code = pgm) {
    try {
        await initService();

        const inparam = ['in_pgm_code', 'in_idx', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm_code, idx, '', ''];
        const inproc = 'scrap.f_scrp0001_set_init_if_data'; 
        await executFunction(inproc, inparam, invalue);
        //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
         
    } catch (ex) {
        throw ex;
    }
}

async function setBLIFData(mainData, if_yn, result, err_msg) {
    try {
        let v_if_yn = if_yn;
        if (err_msg.toString().indexOf("User not authenticated to request the resource") > -1)
        {
            v_if_yn = 'N';
            await checkSession(true);
        }

        const inparam = ['in_pgm_code', 'in_idx', 'in_blno', 'in_create_date', 'in_if_yn','in_result', 'in_err', 'in_user_id', 'in_ipaddr'];
        const invalue = [mainData.pgm_code, idx, mainData.bl_no, mainData.create_date, v_if_yn, result, err_msg, '', ''];
        const inproc = 'scrap.f_scrp0001_set_if_scrap'; 
        await executFunction(inproc, inparam, invalue);
        //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
        
    } catch (ex) {
        throw ex;
    }
}

async function addJsonResult(tab, col, val, row, type = 'update') {
    
  switch (type) {
  case "add":
      //log("addJsonResult add", tab, col, val, row);
      if (!resultData[tab]) {
          resultData[tab] = [];
      }
      resultData[tab].push(row);
      break;
  default:
      //log("addJsonResult default", tab, col, val, row);
      if (!resultData[tab]) {
          resultData[tab] = {};
      }
      resultData[tab][col] = val;

      /* 개선 필요 */
      if (col == 'mode' && !resultData[tab]['servicename']) {
        switch (pgm) {
            case "SCRAP_UFSP_MBL":
                resultData[tab]['servicename'] = 'mwb_' + val.toLowerCase() + 'ctlmgr';
                break;
            case "SCRAP_UFSP_HBL":
                resultData[tab]['servicename'] = 'shipment' + val.toLowerCase() + 'ctlmgr';
                break;
        }
      }
      break;
  }
}

async function startScript(script) {
  let nowData;
  try {
      if (script.length == 0) {
          throw new Error("Script is empty");
      }

      for (var data of script) {
          nowData = data;
          await excuteScript(data);
      }
  } catch(ex) {
      throw  "startScript " + nowData.pgm_code + ',' + nowData.seq + "," + ex;
  }
}

async function excuteScript(data) {
    try {
  //log("callElement-----", data);
        switch(data.method) {
            case "POST":
                return await callAPIPost(data);
            case "SLEEP":
                // sleep(data.header);
                break;
        }
    } catch(ex) {
        throw  "excuteScript " + ex;
    }
}

async function callAPIPost(data) {

    let msg_result;

    try {
        // POST 요청 헤더와 데이터를 설정합니다.
        const url = data.url;
        //let header = data.header;
        const method = data.method;
        let bodyText = JSON.parse(data.body);
        if (data.upd_body_col) {
            let i = 0;
            for (let col of data.upd_body_col.split(',')) {
                let newVal = resultData[mainData.tab][data.upd_body_val.split(',')[i]];
                const cols = col.split('.');
                const result = await updateNodeByPath2(bodyText, cols, newVal);
                i++;
            }
        }
        
        const result = await page.evaluate(async (method, header, url, bodyText) => {

            // POST 요청을 보냅니다.
            let response = await fetch(url, {
              method: method,
              headers: header, //JSON.stringify(header),
              body: JSON.stringify(bodyText),
            });

            const str = response.json();

            // JSON 응답을 파싱하여 결과를 반환합니다.
            return str;
        }, method, header, url, bodyText);
        
        if (result) {
            if (result.count == 0) {
                let if_yn = type == 'E' ? 'I' : 'E';
                await setBLIFData(mainData, if_yn, '', '');
                throw "check exist";
            }
        }

        msg_result = result;

        let arrCol = data.out_col.split(',');
        const out_tabs = data.out_tab.split(',');
        const tabs = data.tab.split(',');
        const ismultirows = data.ismultirow == null ? 'f' : data.ismultirow.split(',');
        let out_tab_cnt = 0;

        for (const out_tab of out_tabs) {            
            let rows = await GetJsonResult2(result, out_tab.split('.'));
            
            const tab = tabs[out_tab_cnt];
            const ismultirow = ismultirows[out_tab_cnt];

            if (data.colinbody) {
                const cols = data.out_col.split(',')[out_tab_cnt];
                const targetJson = await GetJsonNode2(bodyText, cols.split('.'));                
                arrCol = targetJson    
            }

            for (const row of rows) {
                if (row === null) {
                    continue;
                };

                let i = 0;
                let inputRow = {};
                for (const c of arrCol) {
                    let col = c.toLowerCase();
                    if (ismultirow == 't') {
                        inputRow[col] = row[i];
                    }
                    else {
                        let val;
                        if (data.colinbody) {
                            val = row[i];
                        } else {
                            val = row[c];
                        }
                        
                        if (val) {
                            await addJsonResult(tab, col, val, '', '');
                        }
                    }
                    i++;
                }

                if (!isJSONEmpty(inputRow)) {
                    await addJsonResult(tab, '', '', inputRow, 'add');
                }
            }
            out_tab_cnt++;
        }

    } catch(ex) {

        if (msg_result.error == "Unauthorized")

        throw  "callAPIPost : " + JSON.stringify(msg_result) + " / " + ex;
    }
}

async function updateNodeByPath(json, path, newValue) {
    const keys = path.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (json && json.hasOwnProperty(key)) {
            if (typeof json[key][Symbol.iterator] === 'function') {
                json = json[key][0];
            } else {
                json = json[key];
            }
        } else {
            // 경로가 잘못되었거나 해당 키가 없을 경우
            return null;
        }
    }

    const lastKey = keys[keys.length - 1];

    if (json && json.hasOwnProperty(lastKey)) {
        json[lastKey] = newValue;
    } else {
        // 경로가 잘못되었거나 해당 키가 없을 경우
        return null;
    }

    return json;
}

/* [] 일때 loop 돌리기 */
async function updateNodeByPath2(json, path, newValue) {

    let firstKey = path[0];
    let arrPath = path.slice(1);
    let jsons = json;
    if (arrPath.length > 0) { 
        if (firstKey == '[]') {
            for (const targetjson of jsons) {
                await updateNodeByPath2(targetjson, arrPath, newValue);
            }
        } else {
            // if (typeof json[firstKey][Symbol.iterator] === 'function') {
            //     json = json[firstKey][0];
            // } else {
                jsons = jsons[firstKey];
            // }
            await updateNodeByPath2(jsons, arrPath, newValue);
        }

    } else {
        jsons[firstKey] = newValue;
    }
}

function GetJsonNode(json, path) {
    const keys = path.split('.');
    let targetJson = {...json};
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // if (targetJson && targetJson.hasOwnProperty(key)) {
        //     if (typeof targetJson[key][Symbol.iterator] === 'function') {
        //         targetJson = targetJson[key][0];
        //     } else {
        //         targetJson = targetJson[key];
        //     }
        // } else {
        //     // 경로가 잘못되었거나 해당 키가 없을 경우
        //     return null;
        // }
        targetJson = targetJson[key];
    }
    
    const lastKey = keys[keys.length - 1];

    return targetJson[lastKey];
}

async function GetJsonNode2(json, path, isParent = false) {
    
    let firstKey = path[0];
    let arrPath = path.slice(1);
    let result = isParent ? [] : null;
    let targetJson = JSON.parse(JSON.stringify(json));
    if (targetJson) {
        if (arrPath.length > 0) {      
            if (firstKey == '[]') {      
                for (const row of targetJson) {
                    // 수정: 각 하위 결과를 배열에 추가
                    if (isParent) {
                        result.push(await GetJsonNode2(row, arrPath));
                    } else {
                        result = await GetJsonNode2(row, arrPath);
                    }
                }
            } else {
                targetJson = targetJson[firstKey];
                if (isParent) {
                    result.push(await GetJsonNode2(targetJson, arrPath));
                } else {
                    result = await GetJsonNode2(targetJson, arrPath);
                }
            }
        } else {
            result = targetJson[firstKey];
        }
    } else {
        log("GetJsonNode2 : no data!")
    }

    return result;
}

async function GetJsonResult(json, path, isParent = false) {
    
    let firstKey = path[0];
    let arrPath = path.slice(1);
    let result = isParent ? [] : null;
    let targetJson = {...json};
    targetJson = targetJson[firstKey];
    if (arrPath.length > 0) {        
        if (typeof targetJson[Symbol.iterator] === 'function') {
            for (const row of targetJson) {
                // 수정: 각 하위 결과를 배열에 추가
                if (isParent) {
                    result.push(await GetJsonResult(row, arrPath));
                } else {
                    result = await GetJsonResult(row, arrPath);
                }
            } 
        } else {
            result = await GetJsonResult(targetJson, arrPath);
        }
    } else {
        result = targetJson;
    }

    return result;
    
}

async function GetJsonResult2(json, path, result = []) {
    
    let firstKey = path[0];
    let arrPath = path.slice(1);
    //let result = isParent ? [] : null;
    let targetJson = json;
    if (arrPath.length > 0) {    
        if (firstKey == '[]') {
            for (const row of targetJson) {                
                // 수정: 각 하위 결과를 배열에 추가
                // if (isParent) {
                //     result.push(await GetJsonResult2(row, arrPath));
                // } else {
                    await GetJsonResult2(row, arrPath, result);
                // }
            } 
        } else {
            targetJson = targetJson[firstKey];
            // if (isParent) {
            //     result.push(await GetJsonResult2(targetJson, arrPath));
            // } else {
                await GetJsonResult2(targetJson, arrPath, result);
            // }
        }
    } else {
        targetJson = targetJson[firstKey];
        let row;

        if (typeof targetJson[0] === 'object') {
        //if (typeof targetJson[Symbol.iterator] === 'function') {
            row = targetJson[0];
            //log("out firstKey 1", firstKey, row);
        } else {
            row = targetJson;
            //log("out firstKey 2", firstKey, row);
        }
        result.push(row);
    }

    return result;
    
}

function IsJsonString(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

function isJSONEmpty(jsonObj) {
    for (let key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
        return false; // JSON 객체에 속성이 하나 이상 있다면 비어 있지 않음
      }
    }
    return true; // JSON 객체에 속성이 하나도 없으면 비어 있음
  }

async function getBLIFData() {
    try {
        
        log("Start Script");
        const inparam = ['in_pgm_code', 'in_idx', 'in_type', 'in_user_id', 'in_ipaddr'];
        const invalue = [pgm, idx, type, '', ''];
        const inproc = 'scrap.f_scrp0001_get_if_scrap2'; 
        const cursorData = await executFunction(inproc, inparam, invalue);

        return cursorData[0].data;
        
    } catch (ex) {
        log("ex_login:", ex)
    }
}

async function getScript(pgm_code = pgm) {

    resultData = {};

    const inparam = ['in_pgm_code', 'in_user_id', 'in_ipaddr'];
    const invalue = [pgm_code, '', ''];
    const inproc = 'scrap.f_scrp0002_get_script_api'; 
    const cursorData = await executFunction(inproc, inparam, invalue);

    return cursorData[1].data;
    //log(isHeadless);
    // arrThread = new Array(thread_cnt);
    // for (var i = 0; i < thread_cnt; i++) {
    //     arrThread[i] = false;
    // }
}

async function checkSession(isForce = false) {
    let restart = false;

    if (isForce) {
        restart = true;
    }
    else {
        if (lastExcute) {
            const now = new Date();
            const diffMSec = now.getTime() - lastExcute.getTime();
            const diffMin = diffMSec / (60 * 1000);
            if (diffMin > 30) {
                restart = true;
            }
        }
        else {
            restart = true
        }
    }

    if (restart) {
        errCnt = 5; //재시작
        await startBrowser();
        await login();
    }
}

async function startScraping() {

    try {
        onExcute = true;
        mainData = null;
        const datas = await getBLIFData();
        let script;

        log(idx, datas.length);
        if (datas.length > 0) {
            log('datas[0]', datas[0].needlogin);
            if (datas[0].needlogin.toLowerCase() == 't') {
                await checkSession();
            }
            script = await getScript(pgm);
        }

        for (const data of datas) {
            /***************
             * data
             * 1) pgm_code
             * 2) blno
             * 3) create_date
             */
            //log("start=======:", data.blno);
            resultData = {};
            mainData = data;
            //log(data);
            
            // await addJsonResult(data.tab, 'bl_no', data.bl_no, '');
            // await addJsonResult(data.tab, 'trans_type', type, '');

            Object.keys(data).forEach(async function(key) {
                await addJsonResult(data.tab, key, data[key], '');
                // log('Key : ' + key + ', Value : ' + data[key])
              });

            await startScript(script);
            log(idx, "----------------------Finish-----------------------", mainData.bl_no);
            await setBLIFData(mainData, 'O', JSON.stringify(resultData), '');
            errCnt = 0;
            lastExcute = new Date();
            // log(JSON.stringify(resultData));
        }

    }
    catch(ex) {
        if (mainData) {
            error(idx, ": Parent Ex :", ex, mainData.pgm_code, mainData.bl_no);
            await setBLIFData(mainData, 'R', '', ex);
        }        
        errCnt++;
    } finally {
        onExcute = false;
    }
}

const mySetInterval = () => {
    setTimeout(() => {
        if (!onExcute) {
            log(idx, "=================Restart==================")
            startScraping();
        }
        log("mySetInterval : ", onExcute);
        mySetInterval();
        }, 10000);
    };


try {
    log("worker.js시작");
    // setInitBLIFData(); //데이터 분배 스레드 추가로 사용 안함(worker-data-distributor.js)
    startScraping();
    mySetInterval();
} catch (ex) {
    //log처리 추가
    error(ex);
}