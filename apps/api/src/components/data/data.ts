import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
// import { dataContainer } from "@repo/kwe-lib/components/dataContainer";

import { executePostgresProcedure, executeMysqlProcedure } from 'components/db'

import { log, error } from "@repo/kwe-lib-new";
import { ProcedureResult } from "@repo/kwe-lib-new";


/**
 * TODO
 * request 빈값 처리 방안 추가
 * TODO
 * response 공통 모듈 추가
 * TODO
 * Error 공통 모듈 적용
 * TODO
 * JWT Secret Key env 이관 추가
 */
export const getKREAMData = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers["authorization"];

    // const cookieHeader = req.headers.cookie; // 예: "refreshToken=abcd1234; otherCookie=value;"
  
    // if (cookieHeader) {
    // // 간단한 파싱 예시 (실제 코드에서는 robust한 파서 사용 권장)
    // const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    //   const [name, ...rest] = cookie.trim().split('=');
    //   acc[name] = rest.join('=');
    //   return acc;
    // }, {});
    // }

    if (!accessToken) {
      return res.status(401).json({ error: "Access token not provided" });
      // const origin = req.headers.origin;
      // return res.redirect(302, `${origin}/login`);
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.KREAM_SECRET_KEY);
    } catch (err) {
      error("Authorize Error : ", err.message);
      const errResult: ProcedureResult = {
        numericData: -1,
        textData: "Authorize Error : " + err.message
      }

      return res.json(errResult);
    }
    
    const { inproc, inparam, invalue } = req.body;
    const result = await executePostgresProcedure(process.env.KREAM_DB_CONNSTR, inproc, inparam, invalue);
    
    res.json(result);
  } catch (err) {
    error("Error fetching KREAM data:", err);
    res.status(500).json({ error: "Error fetching KREAM data : " + err });
  }
};

export const getTMSData = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(401).json({ error: "Access token not provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.KREAM_SECRET_KEY);
    } catch (err) {
      error("Authorize Error : ", err.message);
      const errResult: ProcedureResult = {
        numericData: -1,
        textData: "Authorize Error : " + err.message
      }

      return res.json(errResult);
    }
    
    const { inproc, inparam, invalue } = req.body;
    const result = await executeMysqlProcedure(process.env.TMS_DB_CONNSTR, inproc, inparam, invalue);
    
    res.json(result);
  } catch (err) {
    error("Error fetching TMS data:", err);
    res.status(500).json({ error: "Error fetching TMS data : " + err });
  }
};

/**
 * TODO
 * request 빈값 처리 방안 추가
 * TODO
 * response 공통 모듈 추가
 * TODO
 * Error 공통 모듈 적용
 * TODO
 * JWT Secret Key env 이관 추가
 */
export const getLimoData = async (req: Request, res: Response) => {
  //2024.05.31 WMS 연동용 API
  log("start");
  try {
    const accessToken = req.headers["authorization"];
    // log(accessToken, req.body)
    if (!accessToken) {
      return res.status(401).json({ error: "Access token not provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, "c61dYZS9QNRbJ2LDtGpNQ0I3dcfxpH6Z9orOeyMuZG8=");
      // log("decode", decoded)
    } catch (err) {
      error("Authorize Error : ", err.message);

      const errorResult: ProcedureResult = {
        numericData: -1,
        textData: "Authorize Error : " + err.message
      };
      return res.json(errorResult);
    }

    const { inproc, inparam, invalue } = req.body;

    if (inproc.split(".")[0].toLowerCase() !== "limo") {
      return res.status(500).json({ error: "LIMO 스키마 외 권한이 없습니다." });
    }

    const result = await executePostgresProcedure(process.env.KREAM_DB_CONNSTR, inproc, inparam, invalue);
    // log(result)
    res.json(result);
  } catch (err) {
    log("WMS API Error fetching data:", err);
    res.status(500).json({ error: "WMS API Error fetching data : " + err });
  }
};
