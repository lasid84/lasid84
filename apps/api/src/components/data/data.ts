import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import { dataContainer } from "@repo/kwe-lib/components/dataContainer";
import { log, error } from "@repo/kwe-lib/components/logHelper";

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
export const getData = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers["authorization"];
    // log(accessToken)
    if (!accessToken) {
      return res.status(401).json({ error: "Access token not provided" });
    }

    // log("api/data", req.body.inproc);
    // let startTime = performance.now();

    try {
      const decoded = jwt.verify(accessToken, "Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E=");
    } catch (err) {
      error("Authorize Error : ", err.message);
      let dc = new dataContainer();
      dc.setNumericData(-1);
      dc.setTextData("Authorize Error : " + err.message);
      return res.json(dc);
    }

    // log("api/data2");
    const { inproc, inparam, invalue } = req.body;
    const result = await callFunction(inproc, inparam, invalue);
    // log("api/data3");
    // log(result)
    // let endTime = performance.now();
    // let timeDiff = endTime - startTime; // 실행 시간 (밀리초)
    // console.log(`Code execution time: ${timeDiff} milliseconds`);

    res.json(result);
  } catch (err) {
    error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data : " + err });
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
      let dc = new dataContainer();
      dc.setNumericData(-1);
      dc.setTextData("Authorize Error : " + err.message);
      return res.json(dc);
    }

    const { inproc, inparam, invalue } = req.body;

    if (inproc.split(".")[0].toLowerCase() !== "limo") {
      return res.status(500).json({ error: "LIMO 스키마 외 권한이 없습니다." });
    }

    const result = await callFunction(inproc, inparam, invalue);
    // log(result)
    res.json(result);
  } catch (err) {
    log("WMS API Error fetching data:", err);
    res.status(500).json({ error: "WMS API Error fetching data : " + err });
  }
};
