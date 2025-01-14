import { Request, Response } from "express";
// import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { parse } from 'node-html-parser';

import { log, error } from '@repo/kwe-lib-new';
import { executePostgresProcedure } from 'components/db'

// const { log, error } = require("@repo/kwe-lib/components/logHelper");
// const { getCall } = require("@repo/kwe-lib/components/api.service");
// const { sleep } = require("@repo/kwe-lib/components/sleep");

interface resultType {
    numericData: number,
    textData: string, 
    cursorData: []
}

export const customsInfo = async (req: Request, res: Response) => {
    
    // /**
    //  * TODO
    //  * Descartes
    //  */
    try {

        if (!req.body.waybill_no) {
            res.status(200).send("no data");
            return;
        }

        const loginResponseStep0 = await axios.get('https://www.myvan.descartes.com/Welcome', {
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            }
        });
        // log('loginResponseStep Location:', loginResponseStep0.data);
        
        // // Step 2: 로그인 응답에서 set-cookie 헤더에 있는 쿠키 가져오기
        const setCookieHeaders = loginResponseStep0.headers['set-cookie'];
        var cookies = setCookieHeaders ? setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ') : '';
        // log('loginResponseStep0-setCookie:', cookies);
        const queryString = loginResponseStep0.request.path.split('?')[1]; // "id=123&url=http://abc"
        const params = new URLSearchParams(queryString);
        // log("loginResponseStep0 QueryParam", params.get("appId"), params.get("returnUrl"));

        const username = req.body.username;
        const password = req.body.password;
        const waybill_nos = req.body.waybill_no.split(',');
        const froms = req.body.from.split(',');
        const tos = req.body.to.split(',');
        const user_id = req.body.user_id;
        const ipaddr = req.body.ipaddr;

        // FormData 생성
        const form = new FormData();
        form.append('UserName', username);
        form.append('Password', password);
        form.append('defaultDomainDB', 'gln.com');
        form.append('returnUrl', params.get("returnUrl"));
        form.append('appId', params.get("appId"));
        form.append('options', 'glnFedSsoTicket=true');

        // log("req.body", req.body, waybill_nos.split(','));
        // return;

        cookies += ";2faRem@gln.com_RQXs1HbzQizKmKSZuyD6UhMev9eTKGCSMF3ajnO+cOIab=#q369iehGGaku+pfDjnwNHqcm2+SFU0kR8Re8LrE4ixey0TSG6euQ8i9mQhBSyt1VI18O94APMso="
        const loginResponseStep1 = await axios.post('https://auth.gln.com/IdentityService/login/login', form, {
            headers: {
                Cookie: cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
            }
        });


        const returnUrl: string = loginResponseStep1.data.ReturnUrl; // ReturnUrl 추출
        // log('loginResponseStep1:', returnUrl,loginResponseStep1.data);
        // return;
        const queryString2 = returnUrl.split('?')[1]; // "id=123&url=http://abc"
        const params2 = new URLSearchParams(queryString2);
        // log('loginResponseStep1 header:', loginResponseStep1);
        // log("loginResponseStep1 param:", params2, params2.toString());

        const loginResponseStep2 = await axios.get('https://www.myvan.descartes.com/Welcome', {
            headers: {
                cookie: 'glnFedSsoCookie=' + params2.get("glnFedSsoTicket")
            }
        });
    
        // log('loginResponseStep2 header:', loginResponseStep2.headers);
        
        // Step 2: 로그인 응답에서 set-cookie 헤더에 있는 쿠키 가져오기
        const setCookieHeaders2 = loginResponseStep2.headers['set-cookie'];
        // 쿠키가 여러 개일 경우, ; (세미콜론)을 기준으로 병합
        const setCookies = setCookieHeaders2 ? setCookieHeaders2.map(cookie => cookie.split(';')[0]).join('; ') : '';

        // log("loginResponseStep3 cookie", setCookies)

        const loginResponseStep3 = await axios.get('https://globalcompliance.descartes.com/login/?glnFedSsoTicket=' + params2.get("glnFedSsoTicket"), {
            headers: {
                Cookie: setCookies + ';BIGipServerglobalcompliance.descartes.com_HTTPS=!04+DpwN+XfCzZkx72k7UiKSYm/ay3RmrgONgTWtAyXKTPOMd2RZoMmXwZb1UvwpbbXPiZ8JEyIIuKCY=; TS013ff8f1=01149d09a53a6cbff1ba35cd8cd9c60cb7e4d32b48d9bec97784f21522d84124a880a0ce7f158dbe8300f2d61712ac5ed87412bb6773a8c8aeb4554fdca1392d70ba0df154a1475e40857941bb8ae502155071eed8a8c9f334d7c9e2fdfcd474f2245c07e71cb3e5561881b3c236e34527f0b8214aafd1bfd0f0183a054b136f9618df175e; acc=a782' + ';glnFedSsoCookie=' + params2.get("glnFedSsoTicket")
            }
        });
        // log("loginResponseStep3", loginResponseStep3.headers, loginResponseStep3.data);

        // Step 2: 로그인 응답에서 set-cookie 헤더에 있는 쿠키 가져오기
        const setCookieHeaders3 = loginResponseStep3.headers['set-cookie'];
        // 쿠키가 여러 개일 경우, ; (세미콜론)을 기준으로 병합
        const setCookies3 = setCookieHeaders3 ? setCookieHeaders3.map(cookie => cookie.split(';')[0]).join('; ') : '';

        // log("loginResponseStep3 cookie", setCookies3)
        var resultData = {
            data: [],
            summary: []
        };

        // for (let i = 0; i < waybill_nos.filter((v,i) => waybill_nos.indexOf(v) === i).length; i++) {
        for (let i = 0; i < waybill_nos.length; i++) {
            const waybill_no = waybill_nos[i];
            const from = convertDate(froms[i]);
            const to = convertDate(tos[i]);

            const form2 = new FormData();
            form2.append('DoSearch', 'True');
            form2.append('searchCriteria.billSearch.From', from);
            form2.append('searchCriteria.billSearch.To', to);
            form2.append('searchCriteria.billSearch.BillNumber', waybill_no);
            form2.append('searchCriteria.voyageSearch.DateType', 'Created');
            form2.append('searchCriteria.billSearch.DateType', 'EstimatedDeparture');

            const getVoyageNumber = await axios.post('https://globalcompliance.descartes.com/Ocean/a782/Voyage', form2, {
                headers: {
                            //로그인 토큰,      로드밸런싱 토큰
                    Cookie: setCookies + ";" + setCookies3,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
                }
            });

            // log("getVoyageNumber", getVoyageNumber.data)

            const htmlData = getVoyageNumber.data;

            // 정규 표현식으로 href 값이 "Bill/Details/"로 시작하는 <a> 태그 찾기
            const regex = /<a\s+href="(\/Ocean\/a782\/Bill\/Details\/[^"]*)"/g;
            const matches = [];
            let match;

            // 반복문을 통해 모든 일치 항목을 배열에 저장
            while ((match = regex.exec(htmlData)) !== null) {
                // log("in while", match);
                await matches.push(match[1]);  // href 값만 저장
            }

            // log("matches", matches);

            for(const path of matches) {
                const getStatus = await axios.get('https://globalcompliance.descartes.com' + path, {
                    headers: {
                                //로그인 토큰,      로드밸런싱 토큰
                        Cookie: setCookies + ";" + setCookies3
                    }
                });

                const htmlData: string = getStatus.data;  // HTML 문자열

                const root = parse(htmlData);
                const rows = root.querySelectorAll('#billDispositionList tbody tr');

                var summary = [];
                rows.forEach((row, index) => {
                    const cells = row.querySelectorAll('td');
                    const rowData = cells.map(cell => cell.text.trim());
                    var convertedJsonData = {};
                    rowData.forEach((cell, i) => {
                        convertedJsonData[i] = cell;

                        if (i === 11 && (cell === '3Z' || cell === '1Y')) {
                            if (!summary.includes(cell)) summary.push(cell);
                        }
                    });
                    convertedJsonData['waybill_no'] = waybill_no;
                    resultData["data"].push(convertedJsonData);
                });

                if (summary.length) {
                    resultData["summary"].push({[waybill_no] : summary.join(',')});
                }
            }
        }
        // log("waybill_nos", waybill_nos, JSON.stringify(resultData["data"]));
        if (resultData["data"].length) {
            const inproc =  "ocean.f_ocen1000_set_descartest_data"
            const inparam = ["in_jsondata", "in_user", "in_ipaddr"];
            const invalue = [JSON.stringify(resultData["data"]), user_id, ipaddr];
            const result:resultType = await executePostgresProcedure(process.env.KREAM_DB_CONNSTR, inproc, inparam, invalue) as resultType;
        }
        
        res.status(200).send(resultData.summary);
        // close();

    } catch (ex) {
        error(ex.message);
    }
    
}


const convertDate = (inputDate) => {
    
  // 연도, 월, 일을 각각 추출
  const year = inputDate.substring(0, 4); // '2024'
  const month = inputDate.substring(4, 6); // '10'
  const day = inputDate.substring(6, 8); // '07'

  // MM/DD/YYYY 형식으로 변환
  return `${month}/${day}/${year}`;
}