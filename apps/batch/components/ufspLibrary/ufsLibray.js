

const puppeteer = require('puppeteer');
// import { getKoreaTime } from '@repo/kwe-lib/components/dataFormatter.js';
// import { executFunction } from './api.service.ts';
// import {log} from '@repo/kwe-lib/components/logHelper.js';

const { workerData } = require('worker_threads'); 
const { executFunction } = require('../api.service/api.service');
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');
const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { decrypt, encrypt } = require('@repo/kwe-lib/components/cryptoJS.js');
const { stringToDateString } = require('@repo/kwe-lib/components/dataFormatter');


const UFSP_ERROR = "UFSP ERROR";
// const { pgm, type, idx, isHeadless } = workerData;

class Library {
    pgm;        // 프로그램(Master,House스크래핑, 차지업로더 등등)
    type;       // Trans Type(I/E)
    terminal    // Terminal ID
    idx;        // 스레드 번호
    isHeadless; // 브라우저 표시 여부
    brower;
    page;
    requestHeader;
    errCnt = 0;
    lastExcute;
    resultData = {};
    mainData = {};
    id = null;
    constructor({ pgm, type, terminal, idx, isHeadless }) {
        this.pgm = pgm;
        this.terminal = terminal;
        this.type = type;
        this.idx = idx;
        this.isHeadless = isHeadless;
    }

    async startBrowser() {
        try {
        if (!this.browser) {
            log(this.pgm, " / ", this.idx, " / brower restart")
            this.browser = await puppeteer.launch(
                { headless:this.isHeadless, 
                    args:[ '--start-maximized'], // you can also use '--start-fullscreen'
                });
        } 

        const pages = await this.browser.pages();
        this.page = pages[0];
        for (let i = 1; i < pages.length; i++) {
            await pages[i].close();
        }
        await this.page.setViewport({width: 0, height: 0});

        // page.on('dialog', async dialog => {
        //     await dialog.accept();
        //   });
        
        // lastExcute = new Date();
        this.lastExcute = getKoreaTime();
        log("lastExcute", this.lastExcute);
    } catch (ex) {
        this.close();
        throw ex;
    }
    };

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    // async checkSession(isForce = false) {
    //     let restart = false;
    
    //     if (isForce) {
    //         restart = true;
    //     }
    //     else {
    //         if (this.lastExcute) {
    //             // const diffMSec = now.getTime() - lastExcute.getTime();
    //             const diffMSec = getKoreaTime() - this.lastExcute.getTime();
    //             const diffMin = diffMSec / (60 * 1000);
    //             if (diffMin > 30) {
    //                 restart = true;
    //             }
    //         }
    //         else {
    //             restart = true
    //         }
    //     }
    
    //     if (restart) {
    //         this.errCnt = 5; //재시작
    //         await this.startBrowser();
    //         await this.login();
    //     }
    // };

    async login() {

        try { 

            log("login");

            const inparam = ['in_pgm_code', 'in_idx', 'in_terminal', 'in_user_id', 'in_ipaddr'];
            const invalue = [this.pgm, this.idx, this.terminal, '', ''];
            const inproc = 'scrap.f_scrp0001_get_login_script'; 
            const cursorData = await executFunction(inproc, inparam, invalue);

            const acctInfo = cursorData[0].data;
            const scripts = cursorData[1].data;

            await this.page.setRequestInterception(true);
            this.page.on('request', (request) => {
                // this.requestHeader = request.headers();
                // if (!this.requestHeader['Content-type']) {
                //     this.requestHeader['Accept'] = 'application/json, text/plain, */*';
                //     this.requestHeader['Content-type'] = 'application/json;charset=UTF-8';
                // }
                request.continue();
            });
            
            for (const script of scripts) {
                switch (script.src_type.toLowerCase()) {
                    case 'selector':
                        await this.callElement(script, acctInfo[0]);
                    // await page.type('#inputEmail','ghlim5501');
                    // await page.type('#inputPassword','1q2w#E$R');

                    // await page.click('#loginForm > div:nth-child(5) > button');
                    // await page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 60000})
                }
            }
            // await sleep(1000);

            let [cookies] = await this.page.cookies();

            //await page.setRequestInterception(false);

        } catch (ex) {
            log("ex_login:", ex)
            throw ex
        }
    }

    async loginByApi(id = '', isForce = false) {

        try { 
            var restart = false;

            if (isForce || (id && this.id !== id)) {
                restart = true;
            } else {
                if (this.lastExcute) {
                    // const diffMSec = now.getTime() - lastExcute.getTime();
                    const diffMSec = getKoreaTime() - this.lastExcute.getTime();
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
                await this.startBrowser();

                const inparam = ['in_pgm_code', 'in_idx', 'in_terminal', 'in_user', 'in_ipaddr'];
                const invalue = [this.pgm, this.idx, this.terminal, id, ''];
                const inproc = 'scrap.f_scrp0001_get_login_script_api';
                const cursorData = await executFunction(inproc, inparam, invalue);

                const acctInfo = cursorData[0].data[0];
                const scripts = cursorData[1].data;

                for (const [key, val] of Object.entries(acctInfo)) {
                    if (key === 'pw') {
                        await this.addJsonResult(acctInfo.tab, key, decrypt(val), '');
                    } else {
                        await this.addJsonResult(acctInfo.tab, key, val, '');
                    }
                }
                // log("loginByApi", id, this.resultData)
                await this.startScript(scripts);

                this.id = id;
            }

        } catch (ex) {
            error("ex_login_api:", this.pgm, this.idx, this.terminal, id, ex)
            throw ex
        }
    }

    async callElement(script, data) {
        
        switch(script.src_type) {
            // case "xpath":
            //     return await callElementXPath(data);
            case "selector":
                return await this.callElementSelector(script, data);
            // case "class":
            //     return await callElementClass(data);
            // default:
            //     return await callElementXPath(data);
        }
    }

    async callElementSelector(script, data) {
        try {
            let action = script.action;
            let src = script.src1;
            let val = data[script.val1] ? data[script.val1] : script.val1;
            let page = this.page;

            switch (action) {
                case "goto":
                    await Promise.all(
                        [page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 300000}), page.waitForNetworkIdle(),
                        page.goto(val, {
                            timeout: 300000,
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
                    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 180000}), page.waitForNetworkIdle(), page.click(src)]);
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
                    const msg = await this.callElement(page, "text", "custom-scrollbar msg-content");
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

    async addJsonResult(tab, col, val, row, type = 'update') {
    
        switch (type) {
        case "addBulk":
            // if (!this.resultData[tab]) {
            //     this.resultData[tab] = [];
            // }
            // for (const r of row) {
            //     let val;

            //     if (this.isValidDate(r)) {
            //         val = this.transformDate(r);
            //     } else {
            //         val = r;
            //     }
            //     this.resultData[tab].push(val);
            // }
            this.resultData[tab] = row;
            // log("============addBulk", tab, this.resultData[tab]);
            break;
        
        case "add":
            // log("addJsonResult add", tab, col, val, row);
            if (!this.resultData[tab]) {
                this.resultData[tab] = [];
            }
            this.resultData[tab].push(row);
            break;
        default:
            // log("addJsonResult default", tab, col, val, row);
            if (!this.resultData[tab]) {
                this.resultData[tab] = {};
            }
            this.resultData[tab][col] = val;
            /* 개선 필요 */
            if (col == 'mode' && !this.resultData[tab]['servicename']) {
              switch (this.pgm) {
                  case "SCRAP_UFSP_MBL":
                  case "SCRAP_UFSP_MBL_OP":
                    this.resultData[tab]['servicename'] = 'mwb_' + val.toLowerCase() + 'ctlmgr';
                    break;
                  case "SCRAP_UFSP_HBL":
                  case "SCRAP_UFSP_HBL_OP":
                    this.resultData[tab]['servicename'] = 'shipment' + val.toLowerCase() + 'ctlmgr';
                    break;
                  default:
                    this.resultData[tab]['servicename'] = 'shipment' + val.toLowerCase() + 'ctlmgr';
                    break;
              }
            }
            break;
        }
    }

    async startScript(script) {
        let nowData;
        try {
            if (script.length == 0) {
                throw new Error("Script is empty");
            }
        
            for (var data of script) {
                nowData = data;
                await this.excuteScript(data);
            }
        } catch(ex) {
            // throw  "startScript " + JSON.stringify(nowData) + "," + ex;
            let seq = nowData? nowData.seq : '';
            let pgm = nowData? nowData.pgm_code : '';
            throw  "startScript " + seq + ' / ' + pgm + "," + ex;
        }
    }

    async excuteScript(data) {
        try {
        // log("callElement-----", data);
            switch(data.method.toUpperCase()) {
                case "POST":
                    return await this.callAPIPost(data);
                case "GET":
                    return await this.callAPIGet(data);
                case "SLEEP":
                    // sleep(data.header);
                    break;
                case "SETROWNUM":
                    return await this.setRowNum(data);
                case "CALCULATECHARGE":
                    return await this.calculateCharge(data);
                case "REMOVESTARTDOT":
                        return await this.removeStartDot(data);
                case "INVOICING":
                    return await this.invoicing(data);
                case "GOTO":
                    return await this.gotoUrl(data);
                case "CHECKWBSTATUS":
                    return await this.CheckWBStatus(data);

            }
        } catch(ex) {
            throw  "excuteScript " + ex;
        }
    }

    async callAPIGet(data) {

        let msg_result;
        let v_tracking = 'start';
        try {
            
            const header = this.convertJSON(data.header);
            const result = await this.executeAPI(data.method, data.url, header, '');
            
            v_tracking = 'send get finish';
        
            msg_result = result;
    
            v_tracking = 'get get result complete';
    
            await this.updateResult(data, '', result);

            v_tracking = 'json data parsing complete';
    
        } catch(ex) {
            // if (msg_result.error == "Unauthorized") throw  "tracking : " + v_tracking + " callAPIPost : " + JSON.stringify(msg_result) + " / " + ex;
            throw  "tracking : " + v_tracking + " callAPIGet : " + JSON.stringify(msg_result) + " / " + ex;
        }
    }

    async callAPIPost(data) {

        let msg_result;
        let v_tracking = 'start';
        try {
            
            v_tracking = 'BodyText Update';

            const url = data.url;
            //let header = data.header;
            const method = data.method;
            //bodyText 업데이트
            var bodyText = await this.updateBodyText(data);
            // log("===========----------------======", JSON.stringify(bodyText));
            v_tracking = 'send post start';
            const header = this.convertJSON(data.header);

            // if (data.seq === '60' ) log("=========", data.seq, JSON.stringify(bodyText))

            const result = await this.executeAPI(method, url, header, bodyText);
            
            v_tracking = 'send post finish' - + JSON.stringify(result);
    
            //2024.08.20 executeAPI 안으로 이동
            // if (result) {
            //     if (result.count == 0) {
            //         let if_yn = this.type == 'E' ? 'I' : 'E';
            //         await this.setBLIFData(if_yn, '', '');
            //         throw "check exist";
            //     }

            //     if (result.errors && result.errors.length) {
            //         msg_result = result.errors.reduce((acc,obj) => acc += obj.message, '');
            //         throw msg_result
            //     }
                
            //     if (result.bat && result.bat.errors.length) {
            //         msg_result = result.bat.errors.reduce((acc,obj) => acc += obj.message, '');
            //         this.mainData.error = msg_result;
            //         throw msg_result
            //     }
            // }
    
            v_tracking = 'get post result complete-' + JSON.stringify(result) /*+ " / " + JSON.stringify(bodyText)*/;
    
            await this.updateResult(data, bodyText, result);

            v_tracking = 'json data parsing complete';
    
        } catch(ex) {
            // if (msg_result.error == "Unauthorized") throw  "tracking : " + v_tracking + " callAPIPost : " + JSON.stringify(msg_result) + " / " + ex;
            // log("=========", data.seq, JSON.stringify(bodyText))
            if (msg_result) throw msg_result;

            throw  "tracking : " + v_tracking + " callAPIPost : " + ex;
        }
    }

    async updateBodyText(data) {
        try {
            var v_tracking = '';
            const url = data.url;
            //let header = data.header;
            const method = data.method;
            let bodyText = JSON.parse(data.body);
            // log("bodyText", bodyText)
            if (data.upd_body_col) {
                let i = 0;
                for (let col of data.upd_body_col.split(',')) {
                    v_tracking = 'start3';
                    const val = data.upd_body_val.split(',')[i];
                    v_tracking = 'start4 /' + val + ' / ' + JSON.stringify(this.resultData);
                    // log("1.", val, this.resultData);
                    let newVal = await this.GetJsonNode2(this.resultData, val.split('.'));
                    if (data.upd_convert_date) {
                        if (Array.isArray(newVal)) {
                            newVal = newVal.map(v => {
                                if (Array.isArray(v)) {
                                    var tempArr = v.map(v2 => {
                                        if (this.isValidDate(v2)) {
                                            return this.transformDate(v2);
                                        } else return v2;  
                                    });
                                    return tempArr;
                                } else if (this.isValidDate(v)) {
                                    return this.transformDate(v);
                                } else return v;
                            });
                        } else if (newVal instanceof Object) {
                            Object.keys(data).forEach(key => {
                                if (this.isValidDate(newVal[key])) {
                                    newVal[key] = this.transformDate(newVal[key]);
                                };
                            });
                        } else {
                            if (this.isValidDate(newVal)) {
                                newVal = this.transformDate(newVal);
                            }
                        }
                    }
                    const cols = col.split('.');
                    await this.updateNodeByPath2(bodyText, cols, newVal);
                    i++;

                    // if (data.seq === '30') log("=======", JSON.stringify(bodyText))
                }
            }

            return bodyText
        } catch (ex) {
            error("updateBodyText", data.seq, v_tracking, ex);
        }
    }

    async executeAPI(method, url, header = {}, bodyText) {

        try {

            var result = await this.page.evaluate(async (method, url, bodyText) => {
                let response = method === 'POST' ?
                    await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type" : "application/json;charset=UTF-8",
                            // "Host": new URL(url).host
                            // ...header
                        },//this.requestHeader,
                        body: JSON.stringify(bodyText),
                    }) :
                    await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type" : "application/json;charset=UTF-8",
                            // "Host": new URL(url).host
                            // ...header
                        },//this.requestHeader,
                    });

                const str = response.json();

                // JSON 응답을 파싱하여 결과를 반환합니다.
                return str;
            }, method,  url, bodyText);

            // log("=====================================result", result, new URL(url).host, JSON.stringify(result));

            //로그인 에러
            if (result && result.success === false) {
                this.mainData['error'] = result.error;
                throw result.error;
            }

            if (result) {
                if (result.count == 0) {
                    let if_yn = this.type == 'E' ? 'I' : 'E';
                    await this.setBLIFData(if_yn, '', '');
                    throw "check exist";
                }

                if (result.errors && result.errors.length) {
                    msg_result = result.errors.reduce((acc,obj) => acc += obj.message, '');
                    throw msg_result
                }
            }

            if (result.bat) {
                if (result.bat.errors.length) {
                    let isOnlyWarning = true;
                    let message = '';

                    message = result.bat.errors.reduce((acc, v) => {
                        if (v.message && v.message.toLowerCase().includes('error')) {
                            isOnlyWarning = false;
                        }

                        return !acc ? v.message : acc + ' / ' + v.message;
                    },'');

                    if (isOnlyWarning) {
                        this.resultData['warning'] = message;
                    } else {
                        this.mainData['error'] = message;
                        throw message;
                    }
                }
            }

            if (result.statusElements) {
                if (result.statusElements[0].severity === 'ERROR') {
                    var message = result.statusElements[0].message;
                    this.mainData['error'] = message;
                    throw message;
                }
            }

            // logWithFile(JSON.stringify(bodyText), JSON.stringify(result));

            return result;
        }
        catch (ex) {
            log("ex", ex);
            throw ex;
        }
    };

    async updateResult(data, bodyText, result) {

        if (!data.out_tab) return result;

        try {
            var v_tracking = 'updateResult start';
            let arrCol = data.out_col.split(',');
            const out_tabs = data.out_tab.split(',');
            const tabs = data.tab.split(',');
            const ismultirows = data.ismultirow == null ? 'f' : data.ismultirow.split(',');
            let out_tab_cnt = 0;

            v_tracking = 'json data parsing0';
            for (const out_tab of out_tabs) {          
                let rows = await this.GetJsonResult2(result, out_tab.split('.'));
                // log("json data parsing0 rows - ", result, out_tab);
                const tab = tabs[out_tab_cnt];
                const ismultirow = ismultirows[out_tab_cnt];
                v_tracking = 'json data parsing1';
                if (data.colinbody) {
                    //2024.05.14 out_col이 [] 인 경우 배열 통째로 resultData에 저장
                    if (data.out_col !== '{}') {
                        const cols = data.out_col.split(',')[out_tab_cnt];
                        const targetJson = await this.GetJsonNode2(bodyText, cols.split('.'));
                        arrCol = targetJson
                    }
                }
                v_tracking = 'json data parsing2';
                // log('---------------------', tab, rows);
                for (const row of rows) {
                    if (row === null) {
                        continue;
                    };

                    if (arrCol[out_tab_cnt] === '{}') {
                        await this.addJsonResult(tab, '', '', row, 'addBulk');
                    } else if (arrCol[out_tab_cnt] === '[]') {
                        await this.addJsonResult(tab, '', '', row, 'add');
                    } else {
                        let i = 0;
                        let inputRow = {};
                        for (const c of arrCol) {
                            let col = c.toLowerCase();
                            if (ismultirow == 't') {
                                inputRow[col] = row[i];
                            } else {
                                let val;
                                if (data.colinbody) {
                                    val = row[i];
                                } else {
                                    val = row[c];
                                }
                                
                                if (val) {
                                    await this.addJsonResult(tab, col, val, '', '');
                                }
                            }
                            i++;
                        }
                        v_tracking = 'json data parsing3';
                        // log(v_tracking, tab, arrCol, inputRow, row);
                        if (!this.isJSONEmpty(inputRow)) {
                            await this.addJsonResult(tab, '', '', inputRow, 'add');
                        }
                    }
                }
                v_tracking = 'json data parsing4';
                out_tab_cnt++;
                
            }
        } catch (ex) {
            throw v_tracking + " / " + ex;
        }
    }

    async getValueFromJson(jsonText, path) {

    }

    async setRowNum(data) {
        if (data.upd_body_col) {
            let i = 0;
            for (let col of data.upd_body_col.split(',')) {

                const val = data.upd_body_val.split(',')[i];
                const cols = col.split('.');
                let newVal = await this.GetJsonNode2(this.resultData, cols);
                const result = await this.updateNodeByPath2(this.resultData, cols, newVal + +val);
                i++;
            }

            // log("calculator - ",this.resultData, this.resultData.arrShipment[404]);
        }
    }

    async removeStartDot(data) {
        if (data.tab) {
            // logWithFile("1)", this.resultData[data.tab])
            this.resultData[data.tab] = this.resultData[data.tab].map(v => {
                if (v.startsWith('.0')) return '0';
                else return v;
            })

            // logWithFile("2)", this.resultData[data.tab])
        }
    }

    /* ※ 차지 저장 함수
        - api 스크립트만으로 처리하기 복잡하여 별로 함수로 처리
    */
    async calculateCharge(data) {
        var v_tracking = 'calculateCharge start';

        try {

            //arrCharge 컬럼 순서
            var arrCharge = ['bc_cost_amt','bc_invoice_charge_amt','category_code','cdate_tz_code','charge_code','cost_amt','cost_currency_code','cost_exchange_rate','created_by','created_date','group_charges_code',
            'invoice_charge_amt','invoice_currency_code','invoice_exchange_rate','last_modified_by','last_modified_date','legacy_charge_seq','line_no','lock_ind','col20dummy','mdate_tz_code','oc_billed_amt','oc_cost_amt',
            'oc_currency_code','oc_invoice_charge_amt','pc_record_id','pipeline_tx_id','rel_pipeline_tx_id','ppc_ind','print_ind','col30dummy','remarks','trv_bc_cost_amt','trv_cost_currency_code','trv_cost_amt','trv_cost_exchange_rate',
            'trv_lock_ind','trv_oc_cost_amt','trv_print_ind','vendor_address_no','vendor_contact_no','vendor_id','vendor_name','vendor_ref_no','col44dummy','col45dummy','col46dummy','col47dummy','pcp_record_id','col49dummy',
            'import_export_ind','append_charge_description','rate_amt','rate_profile_name','partner_charge_profile.rate_on_code','uninv_amt_dummy','amt_to_inv_dummy','terminal_id','charge_status','partner_charge_profile.max_charge_amt',
            'partner_charge_profile.min_charge_amt','charge_codes.charge_type','charge_codes.description','partner_charge_profile.ovrd_default_vendor_ind','partner_charge_profile.ovrd_amt_ind','partner_charge_profile.misc_ind',
            'partner_charge_profile.company_id','partner_charge_profile.assoc_tx_type','col69dummy','col70dummy','impexp_dummy','enable_dummy','invoice_wb_amt','invoice_wb_currency_code','invoice_wb_exchange_rate','cost_wb_amt',
            'cost_wb_currency_code','cost_wb_exchange_rate','trv_cost_wb_amt','trv_cost_wb_currency_code','trv_cost_wb_exchange_rate','cer_type','transport_mode','cer_partner_id','charge_codes.category_code','ll_charge_description',
            'partner_charge_profile.summary_category_code','charge_sort_id','rate','rate_uom','pipeline_tx_status','pipeline_ref_type','pipeline_tx_type','invoice_void_flag','custom_security_ind','vat_cat_code_ap','vat_cat_code_ar',
            'partner_charge_profile.company_charge_profile.company.vat_cost','accrual_cost_ind','partner_charge_profile.partner_id','accrual_status','created_from','mark_up_pct','mark_up_cer_dummy','header_imp_exp_ind_dummy','charge_codes.duty_tax_ind',
            'rowcount_____dummy'
            ]

            var objSeq = {
                'fieldchange' : 0,
                'invoice_charge_amt' : 1,
                'invoice_exchange_rate' : 2,
                'oc_invoice_charge_amt' : 3,
                'invoice_currency_code' : 4,
                'created_date' : 5,
                'actual_cost_amt' : 6,
                'cost_exchange_rate' : 7,
                'oc_cost_amt' : 8,
                'cost_currency_code' : 9,
                // 'created_date' : 10, -> 5번에 입력
                'last_modified_date' : 10,
                'partner_charge_profile.rate_on_code': 16,
                'charge_codes.charge_type' : 18,
                'bc_cost_amt' : 52,
                'bc_invoice_charge_amt' : 53,
                'invoice_wb_amt' : 63,
                'invoice_wb_currency_code' : 64,
                'invoice_wb_exchange_rate' : 65,
                'cer_partner_id' : 71,
                'cer_type' : 72,
                'charge_status' : 73,
                // 'impexp_dummy' : 
                
            }

            v_tracking = 'calculateCharge get bodyText';
            var bodyText = JSON.parse(data.body);

            const updateBodyText = async (body) => {
                for (let key of Object.keys((objSeq))) {
                    if (key === 'fieldchange') continue;
                    let seq = objSeq[key];
                    if (key === 'actual_cost_amt') {
                        key = 'cost_amt';
                    }
                    let val = this.resultData.arrCharge[arrCharge.indexOf(key)];
                    // if (key === 'oc_cost_amt') logWithFile(key, seq, val, bodyText.bat.rqst[0].methodArgs, this.resultData.arrCharge);
                    if (this.isValidDateForUFS(val) || this.isValidDate(val)) {
                        val = this.transformDateForUFS(val, '/');
                    } 
                    bodyText.bat.rqst[0].methodArgs[seq] = val;
                }
                return body
            }

            const updateResult = async (result) => {
                for (let key of Object.keys((objSeq))) {
                    if (key === 'fieldchange') continue;

                    let val = result[objSeq[key]];

                    if (key === 'actual_cost_amt') {
                        key = 'cost_amt';
                    }
                    let seq = arrCharge.indexOf(key);
                    
                    // if (key === 'oc_cost_amt') logWithFile(key, seq, result);

                    if (this.isValidDate(val)) {
                        val = this.transformDate(val);
                    } 
                    // log('======= ', key, seq, val)
                    this.resultData.arrCharge[seq] = val;
                }
            }

            const getVendorAddress = async (vendor_id) => {
                let bodyText = {
                    "time": "23-May-2024 13:11",
                    "bat": {
                      "rqst": [
                        {
                          "serviceName": "PartnerMgr",
                          "methodName": "GetPartner_Address_Contact",
                          "primaryEntity": "partner",
                          "userArgs": [],
                          "singleTableUpdate": "N",
                          "retrieveOrUpdate": "R",
                          "parentClassAttribute": "",
                          "attrList": [
                            "partner_id",
                            "parent_ind",
                            "partner_name",
                            "partner_short_name",
                            "special_instructions",
                            "default_address_no"
                          ],
                          "rowDataList": [],
                          "key": [
                            {
                              "argCol": "Role",
                              "argValue": "RT",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "Port",
                              "argValue": "*",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "LineOfBusiness",
                              "argValue": "",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "ChargesVendor",
                              "argValue": "TRUE",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "ContractType",
                              "argValue": "",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "TransMode",
                              "argValue": "",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "SearchAddressNo",
                              "argValue": "",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "SearchContactNo",
                              "argValue": "",
                              "argOper": "=",
                              "entity": "dummy"
                            },
                            {
                              "argCol": "partner_id",
                              "argValue": "5800",
                              "argOper": "=",
                              "entity": ""
                            }
                          ],
                          "paramValues": [],
                          "methodArgs": []
                        },
                        {
                          "serviceName": "Generic",
                          "methodName": "Select",
                          "primaryEntity": "address",
                          "userArgs": [],
                          "singleTableUpdate": "N",
                          "retrieveOrUpdate": "R",
                          "parentClassAttribute": "partner.address",
                          "attrList": [
                            "address_no",
                            "address_type",
                            "local_language_code",
                            "address_1",
                            "ll_address_1",
                            "address_2",
                            "ll_address_2",
                            "address_3",
                            "ll_address_3",
                            "address_4",
                            "ll_address_4",
                            "address_5",
                            "ll_address_5",
                            "port_code",
                            "city_name",
                            "ll_city_name",
                            "region_code",
                            "postal_code",
                            "ll_postal_code",
                            "region_name",
                            "ll_region_name",
                            "country_code",
                            "country_name",
                            "ll_country_name",
                            "remarks",
                            "default_contact_no",
                            "vendor_site_code",
                            "pipeline_address_ind",
                            "customs_location_id",
                            "ll_partner_name",
                            "special_instructions"
                          ],
                          "rowDataList": [],
                          "key": [],
                          "paramValues": [],
                          "methodArgs": []
                        },
                        {
                          "serviceName": "Generic",
                          "methodName": "Select",
                          "primaryEntity": "contact",
                          "userArgs": [],
                          "singleTableUpdate": "N",
                          "retrieveOrUpdate": "R",
                          "parentClassAttribute": "partner.address.default_contact",
                          "attrList": [
                            "contact_no",
                            "contact_function_code",
                            "first_name",
                            "salutation",
                            "middle_initial",
                            "local_language_code",
                            "last_name",
                            "ll_name",
                            "office_no",
                            "ll_office_no",
                            "title",
                            "ll_title",
                            "phone_no",
                            "cell_phone_no",
                            "fax_no",
                            "pager_no",
                            "telex_no",
                            "email_id",
                            "remarks",
                            "preferred_contact_mode",
                            "pipeline_contact_ind",
                            "ll_first_name",
                            "ll_salutation",
                            "ll_middle_initial"
                          ],
                          "rowDataList": [],
                          "key": [],
                          "paramValues": [],
                          "methodArgs": []
                        }
                      ]
                    }
                 };
                
                if (!vendor_id) return;

                bodyText.bat.rqst[0].key[8].argValue = vendor_id;
                const result = await this.executeAPI('POST', data.url, data.header, bodyText);

                /*
                    result.bat.errors 처리 필요
                */

                let seq = arrCharge.indexOf('vendor_name');
                //ret[0].dataSet[0].attrData: ["5501","N","SEOUL OPERATION OFFICE","KWHSELSLS","","30242630652"]
                //ret[1].dataSet[0].attrData: ["30242630652","RT","","KWE BLDG., 303","","BANGHWA-DAERO","","GANGSEO-GU","","","","","","","SEOUL","","","07605","","","","KR","KOREA","","","","068","N","","",""]
                this.resultData.arrCharge[seq] = result.bat.ret[0].dataSet[0].attrData[2];

                seq = arrCharge.indexOf('vendor_address_no');
                this.resultData.arrCharge[seq] = result.bat.ret[1].dataSet[0].attrData[0];
                
                seq = arrCharge.indexOf('col44dummy');
                this.resultData.arrCharge[seq] = result.bat.ret[1].dataSet[0].attrData[3] + ', ' + result.bat.ret[1].dataSet[0].attrData[5];
            }

            v_tracking = 'calculateCharge update BodyText';
            bodyText = await updateBodyText(bodyText);
                        
            if (this.resultData.t_hbl_charge_if) {
                for (const key of Object.keys((this.resultData.t_hbl_charge_if))) {
                    let lowerKey = key.toLowerCase();
                    let val = this.resultData.t_hbl_charge_if[lowerKey];
                    let idx = arrCharge.indexOf(lowerKey);
                    // log("calculateCharge", key, this.resultData.t_hbl_charge_if[key], this.resultData.arrCharge[arrCharge.indexOf(lowerKey)], val);

                    if (val === null) continue;

                    v_tracking = 'calculateCharge update BodyText2 - ' + lowerKey;

                    switch (lowerKey) {
                        case "import_export_ind":
                        case "ppc_ind":
                        case "vendor_id":
                        case "vendor_ref_no":
                        case "print_ind":
                        case "vat_cat_code_ap":
                            this.resultData.arrCharge[idx] = val;

                            if (lowerKey === 'vendor_id') {
                                await getVendorAddress(val);
                            }

                            break;
                        case "invoice_wb_amt":
                        case "invoice_wb_currency_code":
                        // case "invoice_charge_amt":  --UFS+에서 invoice_wb_amt 입력하면 자동으로 따라오게 되어 있음
                        case "invoice_currency_code":
                        case "actual_cost_amt":
                        case "cost_currency_code":
                            bodyText.bat.rqst[0].methodArgs[0] = lowerKey;
                            if (lowerKey === 'actual_cost_amt') {
                                lowerKey = 'cost_amt';
                                idx = arrCharge.indexOf(lowerKey);
                            }

                            this.resultData.arrCharge[idx] = val;
                            bodyText = await updateBodyText(bodyText);
                            const result = await this.executeAPI('POST', data.url, data.header, bodyText);
                            // if (lowerKey === 'cost_amt') logWithFile(key, JSON.stringify(bodyText), JSON.stringify(result));
                            await updateResult(result.bat.methodReturn.arguments);
                            bodyText = await updateBodyText(bodyText);

                            // if (lowerKey ==='invoice_wb_amt') log("============================invoice_wb_amt", JSON.stringify(bodyText), JSON.stringify(result.bat.methodReturn.arguments));
                            break;
                    }
                }
            }
        } catch (e) {
            error("calculateCharge - ", v_tracking, e.message)
            throw v_tracking, e
        }
    }

    /* ※ 인보이스 저장 함수
         - api 스크립트만으로 처리하기 복잡하여 별로 함수로 처리
         - 인보이스 디테일에 여러건을 넣어야 하기때문에 스크립트로 처리 어려움
    */ 
    async invoicing(data) {

        try {

            var v_tracking = 'calculateCharge get bodyText';
            var bodyText = JSON.parse(data.body);
            const bodyCols = data.upd_body_col.split(',');
            const bodyVals = data.upd_body_val.split(',');

            v_tracking = 'update Input value in resultData';
            if (!this.resultData.partnercont) this.resultData.partnercont = [];
            this.resultData.invoice[4] = this.transformDate(stringToDateString(this.resultData.t_hbl_charge_if.invoice_dd,'-'));
            this.resultData.invoice[6] = this.resultData.t_hbl_charge_if.govt_invoice_no;
            this.resultData.invoice[18] = this.resultData.t_hbl_charge_if.billto_id;
            this.resultData.invoice[19] = this.resultData.partner[2];     //billto_name
            this.resultData.invoice[20] = this.resultData.partner[5];     //billto_address_no
            this.resultData.invoice[21] = this.resultData.partnercont[0]; //billto_contact_no
            this.resultData.invoice[33] = this.resultData.t_hbl_charge_if.inv_remark;
            this.resultData.invoice[126] = this.resultData.t_hbl_charge_if.invoice_edi_date;

            v_tracking = 'calculateCharge update BodyText';
            for (let i = 0; i < bodyCols.length; i++) {
                let col = bodyCols[i];
                let val = bodyVals[i];
                
                var input = await this.GetJsonNode2(this.resultData, val.split('.'));
                await this.updateNodeByPath2(bodyText, col.split('.'), '');   
                if (val === 'INVOICE_DETAIL') {
                    var arrVal = [];
                    input.forEach(async (arr, idx) => {
                        var objInput = {
                            "actionFilter" : "I",
                            "rownum" : idx+1,
                            "orgAttrData" : arr.map(v => {
                                if (data.upd_convert_date && this.isValidDate(v)) {
                                    return this.transformDate(v);
                                } else  return v;
                            })
                        }                   
                        await arrVal.push(objInput);
                    });
                    await this.updateNodeByPath2(bodyText, col.split('.'), arrVal);
                    
                } else {
                    if (data.upd_convert_date && Array.isArray(input)) {
                        input = input.map(v => {
                            if (this.isValidDate(v)) {
                                log("this.transformDate(v);", this.transformDate(v));
                                return this.transformDate(v);
                            } else  return v;
                        })
                    }
                    await this.updateNodeByPath2(bodyText, col.split('.'), input);
                }
            }
            
            v_tracking = 'start executeAPI';
            const result = await this.executeAPI('POST', data.url, data.header, bodyText);
            v_tracking = 'end executeAPI' + JSON.stringify(result);
            await this.updateResult(data, '', result);
            v_tracking = 'end updateResult';

        } catch (e) {
            error("invoicing - ", v_tracking, e.message, JSON.stringify(bodyText));
            throw v_tracking, e
        }
    }

    async gotoUrl(data) {
        await Promise.all(
            [this.page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 180000}), this.page.waitForNetworkIdle(),
            this.page.goto(data.url, {
                timeout: 180000,
                // ❸ 모든 네트워크 연결이 500ms 이상 유휴 상태가 될 때까지 기다림
                waitUntil: ['networkidle0','domcontentloaded'],
            })]);
    }

    async CheckWBStatus(data) {
        var wbStatus = data.upd_body_col.split(',');
        var val = await this.GetJsonNode2(this.resultData, data.body.split('.'))

        log("============================================CheckWBStatus", wbStatus, val, data, this.resultData);

        if (!wbStatus.includes(val)) {
            this.mainData.error = `BL Status가 ${val}입니다.` 
            throw "";
        }
    }

    /* [] 일때 loop 돌리기 */
    async updateNodeByPath2(json, path, newValue) {

        let firstKey = path[0];
        let arrPath = path.slice(1);
        let jsons = json;
        if (arrPath.length > 0) { 
            if (firstKey == '[]') {
                for (const targetjson of jsons) {
                    // log("====updateNodeByPath2", targetjson, arrPath, val, ismultirow);
                    await this.updateNodeByPath2(targetjson, arrPath, newValue);
                }
            } else {
                jsons = jsons[firstKey];
                await this.updateNodeByPath2(jsons, arrPath, newValue);
            }

        } else {
            if (Array.isArray(newValue)) {
                if (!jsons[firstKey]) jsons[firstKey] = [];
                // jsons[firstKey] = [];
                for (const v of newValue) {
                    jsons[firstKey].push(v);
                }
            } else {
                jsons[firstKey] = newValue;                
            }
        }
    }

    async GetJsonResult2(json, path, result = []) {
    
        // log("=========", json, path, result);
        try {
            let firstKey = path[0];
            let arrPath = path.slice(1);
            //let result = isParent ? [] : null;
            let targetJson = json;
            if (arrPath.length > 0) {    
                if (firstKey == '[]') {
                    for (const row of targetJson) {                
                        //2024.07.22 이건 타지는게 없을듯, 확인 후 삭제 필요
                        await this.GetJsonResult2(row, arrPath, result);
                    } 
                } else {
                    targetJson = targetJson[firstKey];
                    // if (isParent) {
                    //     result.push(await GetJsonResult2(targetJson, arrPath));
                    // } else {
                        await this.GetJsonResult2(targetJson, arrPath, result);
                    // }
                }
            } else {
                let row;
                if (firstKey == '[]') {
                    //2024.07.22 이건 타지는게 없을듯, 확인 후 삭제 필요
                    row = targetJson;
                    result.push(...row);
                } else {
                    targetJson = targetJson[firstKey];

                    if (typeof targetJson[0] === 'object') {
                        row = targetJson[0];
                        // log("out firstKey 1", firstKey, row);
                    } else {
                        row = targetJson;
                        // log("out firstKey 2", firstKey, row);
                    }

                    result.push(row);
                }
            }

            return result;
        } catch (ex) {
            return null
        }
        
    }

    async GetJsonNode2(json, path, isParent = false) {
    
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
                            result.push(await this.GetJsonNode2(row, arrPath));
                        } else {
                            result = await this.GetJsonNode2(row, arrPath);
                        }
                    }
                } else {
                    targetJson = targetJson[firstKey];
                    if (isParent) {
                        result.push(await this.GetJsonNode2(targetJson, arrPath));
                    } else {
                        result = await this.GetJsonNode2(targetJson, arrPath);
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

    isJSONEmpty(jsonObj) {
        for (let key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            return false; // JSON 객체에 속성이 하나 이상 있다면 비어 있지 않음
          }
        }
        return true; // JSON 객체에 속성이 하나도 없으면 비어 있음
    }

    convertJSON (str) {
        try {
            const val = JSON.parse(str);
            return val;
          } catch (error) {
            return '';
          }
    }

    async getScript() {
    
        const inparam = ['in_pgm_code', 'in_user_id', 'in_ipaddr'];
        const invalue = [this.pgm, '', ''];
        const inproc = 'scrap.f_scrp0002_get_script_api'; 
        const cursorData = await executFunction(inproc, inparam, invalue);
    
        return cursorData[1].data;
    }

    isValidDate(dateString) {
        if (!dateString) return false;
        // 날짜 형식 검사
        var regex = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}$/;
        // const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
        if (!regex.test(dateString)) {
            regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!regex.test(dateString)) {
                return false;
            }
        }
      
        // 날짜 객체 생성
        const date = new Date(dateString);
      
        // // 유효성 검사 (NaN 체크)
        // if (isNaN(date.getTime())) {
        //   return false;
        // }

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return false;
        }
      
        // 유효한 날짜 문자열
        return true;
      }

    transformDate(dateString, symbol = '-') {
        // if (!this.isValidDate(dateString)) {
        //     return null;
        //   }
        
          // 날짜 객체 생성
          const date = new Date(dateString);
        
          // 월 이름 변환
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthIndex = date.getMonth();
          const monthName = monthNames[monthIndex];
        
          // 변환된 날짜 문자열 생성
          const transformedDateString = `${date.getDate().toString().padStart(2, '0')}${symbol}${monthName}${symbol}${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
          return transformedDateString;
    }

    //Body에는 dd/MM/yyyy 형식으로 값을 넣어야함
    isValidDateForUFS(dateString) {
        if (!dateString) return false;
        // 날짜 형식 검사
        const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
        // const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
        if (!regex.test(dateString)) {
          return false;
        }
      
        // 날짜 객체 생성
        const date = new Date(dateString);
      
        // // 유효성 검사 (NaN 체크)
        // if (isNaN(date.getTime())) {
        //   return false;
        // }

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return false;
        }
      
        // 유효한 날짜 문자열
        return true;
      }

    transformDateForUFS(dateString, symbol = '/') {

        if (!this.isValidDateForUFS(dateString)) {
            return null;
          }
        
          // 날짜 객체 생성
          const date = new Date(dateString);
        
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0 to 11
          const year = date.getFullYear();

          var transformedDateString = `${day}/${month}/${year}`;
        
          return transformedDateString;
    }

    async getIFData() {
        try {
            
            // log("Start Script");
            const inparam = ['in_pgm_code', 'in_idx', 'in_type', 'in_user_id', 'in_ipaddr'];
            const invalue = [this.pgm, this.idx, this.type, '', ''];
            const inproc = 'scrap.f_scrp0001_get_if_scrap2'; 
            const cursorData = await executFunction(inproc, inparam, invalue);
    
            return cursorData[0].data;
            
        } catch (ex) {
            log("ex_login:", ex)
        }
    }

    async setBLIFData(if_yn, result, err_msg) {
        try {
            let v_if_yn = if_yn;
            if (err_msg.toString().indexOf("User not authenticated to request the resource") > -1)
            {
                v_if_yn = 'N';
                // await this.checkSession(true);
                await this.loginByApi('', true);
            }
    
            const inparam = ['in_pgm_code', 'in_idx', 'in_blno', 'in_create_date', 'in_if_yn','in_result', 'in_err', 'in_user_id', 'in_ipaddr'];
            const invalue = [this.pgm, this.idx, this.mainData.bl_no, this.mainData.create_date, v_if_yn, result, err_msg, '', ''];
            const inproc = 'scrap.f_scrp0001_set_if_data'; 
            await executFunction(inproc, inparam, invalue);
            //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
            
        } catch (ex) {
            throw ex;
        }
    }

    async setChargeIFData() {
        try {
            var uuid = this.resultData.t_hbl_charge_if.uuid;
            var remark = this.resultData.warning ? this.resultData.warning : '';
            // var remark = this.resultData.arrCharge; //안정화 이후 위 코드로 사용(warning 값 적용);
            var record_id = this.resultData.arrCharge[25];
            const inparam = ['in_uuid', 'in_record_id', 'in_remark', 'in_user_id', 'in_ipaddr'];
            const invalue = [uuid, record_id, remark, '', ''];
            const inproc = 'scrap.f_scrp0002_set_if_charge_data'; 
            await executFunction(inproc, inparam, invalue);
            //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
            
        } catch (ex) {
            throw ex;
        }
    }

    async setInvoicingIFData() {
        try {
            var inv_group = this.resultData.t_hbl_charge_if.inv_group;

            var remark = this.resultData.warning ? this.resultData.warning : '';
            // var remark = this.resultData.arrCharge; //안정화 이후 위 코드로 사용(warning 값 적용);
            var record_id = this.resultData.arrCharge[25];
            const inparam = ['in_uuid', 'in_record_id', 'in_remark', 'in_user_id', 'in_ipaddr'];
            const invalue = [uuid, record_id, remark, '', ''];
            const inproc = 'scrap.f_scrp0002_set_if_charge_data'; 
            await executFunction(inproc, inparam, invalue);
            //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
            
        } catch (ex) {
            throw ex;
        }
    }

    async getChargeUploadData() {
    
        const inparam = ['in_pgm_code', 'in_idx', 'in_uuid', 'in_type', 'in_user_id', 'in_ipaddr'];
        const invalue = [this.pgm, this.idx, this.mainData.bl_no, this.type, '',''];
        const inproc = 'scrap.f_scrp0002_get_charge_upload_data'; 
        const cursorData = await executFunction(inproc, inparam, invalue);
    
        return cursorData[0].data;
    }

    async setChargeUploadData(if_yn, result, err_msg) {
        try {
            let v_if_yn = if_yn;
            if (err_msg.toString().indexOf("User not authenticated to request the resource") > -1)
            {
                v_if_yn = 'N';
                //await ufsp.checkSession(true);
                await this.loginByApi('', true);
            }
    
            const inparam = ['in_pgm_code', 'in_idx', 'in_blno', 'in_seq', 'in_if_yn','in_result', 'in_err', 'in_user_id', 'in_ipaddr'];
            const invalue = [this.pgm, this.idx, this.mainData.bl_no, this.mainData.seq, v_if_yn, result, err_msg, '', ''];
            const inproc = 'scrap.f_scrp0002_set_if_charge_data'; 
            await executFunction(inproc, inparam, invalue);
            //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
            
        } catch (ex) {
            throw ex;
        }
    }

    async insertIFData(key = '') {
        try {    

            const inparam = ['in_pgm_code', 'in_blno', 'in_user_id', 'in_ipaddr'];
            const invalue = [this.pgm, key, '', ''];
            const inproc = 'scrap.f_scrp0001_ins_if_data'; 
            await executFunction(inproc, inparam, invalue);
            //log("setBLIFData완료!!!!!!!!!!!!!!!!!!!!!!!!!!!!", mainData) ;
            
        } catch (ex) {
            throw ex;
        }
    }

}

module.exports = Library;