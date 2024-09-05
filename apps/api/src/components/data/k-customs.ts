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

/**
 ※ 2024.08.05 관세청 유니패스
  1. 화물통관 진행정보
  2. token 체크
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

                // XML 데이터를 JSON으로 변환
                await parseString(xmlData, (err, result) => {
                    if (err) {
                        res.status(500).send({ error: 'Failed to parse XML' });
                    } else {
                        let msg = result.cargCsclPrgsInfoQryRtnVo.ntceInfo ? result.cargCsclPrgsInfoQryRtnVo.ntceInfo[0] : '';
                        if (!msg.startsWith('[N00')) {
                            jsonResult.push(result);
                        }
                    }
                });
                sleep(100);
            } 
        } 

        if (jsonResult.length > 0) {
            const inproc =  "unipass.f_api001_set_data"
            const inparam = ["in_data", "in_user", "in_ipaddr"];
            const invalue = [JSON.stringify(jsonResult), user, ipaddr];
            const result:resultType = await callFunction(inproc, inparam, invalue) as resultType;
            log("!!!!!!!!", result, JSON.stringify(jsonResult));
            if (result.numericData === 0) {
                res.status(200).send({result});
            } else {
                res.status(300).send({result});
            }
        } else {
            res.status(300).send({numericData: -1,
                textData: 'Not Exist Data', 
                cursorData: null});
        }
    } catch (ex) {
        log(ex.message);
    }
    
  }