import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { log, error } from "@repo/kwe-lib/components/logHelper";
import { parseString } from 'xml2js';
import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";

const { getCall } = require("@repo/kwe-lib/components/api.service");
const { sleep } = require("@repo/kwe-lib/components/sleep");

const unipassUrl = "https://unipass.customs.go.kr:38010/ext/rest";


interface resultType {
    numericData: number,
    textData: string, 
    cursorData: []
}

export const healthcheck = async (req: Request, res: Response) => {
    res.status(200).send("ok");
}

/* TODO
    1. 토큰 처리
    2. 로직 변경(검토)
      - 관세청 api 호출 후 반환된 데이터를 Front로 그대로 전달
      - 이후 Front에서 DB 저장 프로시저 호출
    3. 콜, xml Parsing 모듈화
*/


/**
 ※ 2024.08.05 관세청 유니패스
  1. 화물통관 진행정보
*/
export const getCargCsclPrgsInfoQry = async (req: Request, res: Response) => {
    const crkyCn = "h260n224d077a263h070x020g0";
    const serviceUrl = "/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo";
    
    /* 1. Unipass 서비스 ID
         - API001
       
       2. Request Parameter
       항목명     항목명      항목크기 항목구분   항목설명
      cargMtNo  화물관리번호    19       0      화물관리번호 15 ~ 19자리        
      mblNo     MBL번호        20       0      Master BL No
      hblNo     HBL번호        20       0      House BL No
      blYy      BL 년도        4        0      입항년도(MBL 또는 HBL 입력시 필수 입력)  
    */
    
    const cargMtNo = req.body.cargMtNo;
    const mblNo = req.body.mblNo as string;
    const hblNo = req.body.hblNo as string;
    const blYy = req.body.blYy;
    const seaFlghIoprTpcd = req.body.seaFlghIoprTpcd;  //10: 입항, 11:출항
    const user = req.body.user_id;
    const ipaddr = req.body.ipaddr;

    const jsonResult = [];

    /**
     * TODO
     * mblNo 로 조회했을때 처리 추가
     */
    try {
        if (hblNo) {
            for (const hbl of hblNo.split(' ')) {
                if (!hbl) continue;

                const url = `${unipassUrl}${serviceUrl}?crkyCn=${crkyCn}`
                        // + (cargMtNo ? `&cargMtNo=${cargMtNo}` : '')
                        + (hbl ? `&hblNo=${hbl}` : '')
                        + (blYy ? `&blYy=${blYy}` : '')
                        ;

                const response = await getCall({url:url});
                
                const xmlData: string = response.data;

                const parseStringPromise = (xmlData) => {
                    return new Promise( (resolve, reject) => {
                      parseString(xmlData, async (err, result) => {
                        if (err) {
                            res.status(500).send({ error: 'Failed to parse XML' });
                        } else {
                            let msg = result.cargCsclPrgsInfoQryRtnVo.ntceInfo ? result.cargCsclPrgsInfoQryRtnVo.ntceInfo[0] : '';
                            if (!msg.startsWith('[N00')) {
                                
                                for (var row of result.cargCsclPrgsInfoQryRtnVo.cargCsclPrgsInfoDtlQryVo) {
                                    if (row.cargTrcnRelaBsopTpcd[0] === '입항보고 제출' || row.cargTrcnRelaBsopTpcd[0] === '입항보고 수리') {
                                        var dclrNo = row.dclrNo[0];
                                        var data: any = await retrieveFlghEtprRprtBrkd({ioprSbmtNo:dclrNo});
                                        for (const key of Object.keys(data.flghEtprRprtBrkdQryRtnVo.flghEtprRprtBrkdQryVo[0])) {
                                            row[key] = data.flghEtprRprtBrkdQryRtnVo.flghEtprRprtBrkdQryVo[0][key]
                                        }
                                    }
                                }
                                // log("result", result);
                                jsonResult.push(result);
                            }
                        }
                        resolve(result);
                      });
                    });
                  };

                // XML 데이터를 JSON으로 변환
                let r = await parseStringPromise(xmlData);
            }
        } 

        const inproc =  "unipass.f_api001_set_data"
        const inparam = ["in_data", "in_user", "in_ipaddr"];
        const invalue = [JSON.stringify(jsonResult), user, ipaddr];
        const result2:resultType = await callFunction(inproc, inparam, invalue) as resultType;
        // log("!!!!!!!!", JSON.stringify(jsonResult));
        if (result2.numericData === 0) {
            res.status(200).send({result2});
        } else {
            res.status(300).send({result2});
        }

    } catch (ex) {
        error(ex.message);
    }
    
  }

  /**
 ※ 2024.09.12 관세청 유니패스
  1. 입항보고내역조회(항공)
*/
export const retrieveFlghEtprRprtBrkd = async (params:any) => {
    const crkyCn = "g250p204x029y172j040p010u0";
    const serviceUrl = "/etprRprtQryBrkdQry/retrieveFlghEtprRprtBrkd";

    /* 1. Unipass 서비스 ID
         - API024
       
       2. Request Parameter
       항목명           항목명          항목크기   항목구분   항목설명
      ioprSbmtNo    입출항제출번호      12         1         입출항제출번호 또는 선박호출부호 필수입력 
      shipCallSgn   선박호출부호        12         1         입출항제출번호 또는 선박호출부호 필수입력
    */

    const ioprSbmtNo = params.ioprSbmtNo;
    const shipFlgtNm = params.shipFlgtNm;
    const etprDt = params.etprDt;

    const url = `${unipassUrl}${serviceUrl}?crkyCn=${crkyCn}`
                        + (ioprSbmtNo ? `&ioprSbmtNo=${ioprSbmtNo}` : '')
                        + (shipFlgtNm ? `&shipFlgtNm=${shipFlgtNm}` : '')
                        + (etprDt ? `&etprDt=${etprDt}` : '')
                        ;

    const response = await getCall({url:url});
    // log("retrieveFlghEtprRprtBrkd", url, response.data)
    const xmlData: string = response.data;
    var jsonResult = {}
    // XML 데이터를 JSON으로 변환
    await parseString(xmlData, async (err, result) => {
        if (err) {
            jsonResult = { error: 'Failed to parse XML' };
        } else {
            let msg = result.flghEtprRprtBrkdQryRtnVo.ntceInfo ? result.flghEtprRprtBrkdQryRtnVo.ntceInfo[0] : '';
            if (!msg.startsWith('[N00')) {        
                // log("=================", result)        
                jsonResult = result
            } else {
                jsonResult = {error:msg}
            }
        }
    });

    return jsonResult;
}