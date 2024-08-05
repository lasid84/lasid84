import { Request, Response } from "express";

import { checkAccount } from "@repo/kwe-lib/components/ldapHelper";
import { dataContainer } from "@repo/kwe-lib/components/dataContainer";
import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import { log, error } from "@repo/kwe-lib/components/logHelper";

/**
 * TODO
 * request 빈값 처리 방안 추가
 * TODO
 * response 공통 모듈 추가
 * TODO
 * Error 공통 모듈 적용
 */
export const login = async (req: Request & { user_nm?: string }, res: Response) => {
  try {
    //패스워드 암호처리, 복구 필요
    // log("========",req);
    const { user_id, password } = req.body;

    if (user_id === "") {
      return res.json({ success: false, message: "Input ID", token: "", userData: "" });
    }

    await checkAccount(user_id, password, async (isAuthenticated: any, userObject: any, err: any) => {
      if (isAuthenticated) {
        const token = "";

        const params = {
          inparam: ["in_user_id", "in_user_nm", "in_ipaddr"],
          invalue: [user_id, userObject, ""],
          inproc: "public.f_admn_get_userauth",
        };
        let dc: any = new dataContainer();
        dc = await callFunction(params.inproc, params.inparam, params.invalue);
        if (dc.getNumericData() === 0) {
          req.user_nm = userObject;
          // 인증 성공시 처리
          res.json({
            success: true,
            message: "Authentication successful",
            user_nm: userObject,
            userData: dc.getCursorData()[0].data,
            token: token,
          });
        } else {
          req.user_nm = "Invalid Credentials";
          res.json({
            success: false,
            message: dc.getNumericData() + " - " + dc.getTextData(),
            token: "",
            userData: "",
          });
        }
      } else {
        // 인증 실패시 처리
        log("실패");
        //res.status(401).json({ success: true, message: 'Authentication failed' });
        res.json({ success: false, message: "Authentication failed - " + err, token: "", userData: "" });
      }
    });
    // next();
  } catch (ex) {
    error("/login", ex.message);
  }
};

/**
 * TODO
 * response 공통 모듈 추가
 * TODO
 * Error 공통 모듈 적용
 * NOTE
 * Session 방식이 아닐경우 해당 코드의 필요성 확인 필요
 * NOTE
 * Refresh Token 관리 방식 확인 필요
 */
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      sameSite: "lax",
    });
    //await authService.logout(req.user);
    return res.send();
  } catch (ex) {}
};
