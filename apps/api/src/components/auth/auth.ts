import { Request, Response } from "express";

// import { checkAccount } from "@repo/kwe-lib/components/ldapHelper";
// import { dataContainer } from "@repo/kwe-lib/components/dataContainer";
// import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
// import { log, error } from "@repo/kwe-lib/components/logHelper";

import { checkAccount } from 'components/auth/ldap';
import { executePostgresProcedure } from 'components/db'
import { ProcedureResult, signJwtAccessToken } from '@repo/kwe-lib-new';
import { log, error } from "@repo/kwe-lib-new";

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
        
        const params = {
          inparam: ["in_user_id", "in_user_nm", "in_ipaddr"],
          invalue: [user_id, userObject, ""],
          inproc: "public.f_admn_get_userauth",
        };
        
        const isProduction = process.env.NODE_ENV === 'production';
        
        const result: ProcedureResult = await executePostgresProcedure(process.env.KREAM_DB_CONNSTR, params.inproc, params.inparam, params.invalue);
        if (result.numericData === 0) {
          const token = signJwtAccessToken({user_id});
          req.user_nm = userObject;
          // log("checkAccount", result, 'refreshToken', token, isProduction)
          // 인증 성공시 처리
          res
            .cookie('KREAMToken', token, {
              httpOnly: true,           // 자바스크립트로 접근 불가
              secure: isProduction,     // 프로덕션 환경에서는 HTTPS에서만 전송
              sameSite: 'lax',          // CSRF 방지
              path: '/',                // 쿠키 적용 경로
              // domain: 'localhost',  // 명시적 도메인 설정
              maxAge: 1 * 24 * 60 * 60 * 1000  // 쿠키 만료 시간 설정 (예: 7일)
            })
            .json({
            success: true,
            message: "Authentication successful",
            user_nm: userObject,
            userData: result.cursorData[0].data,
            KREAMToken: token,
          })
          // .status(200).send("ok")
          ;
        } else {
          req.user_nm = "Invalid Credentials";
          res.json({
            success: false,
            message: result.numericData + " - " + result.textData,
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
