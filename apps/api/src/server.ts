import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import compression from "compression";
//import {log, callFunction, checkAccount} from "@repo/kwe-lib";
//import {callFunction} from "@repo/kwe-lib";
// import {callFunction} from "@repo/kwe-lib/components/dbDTOHelper";
// const {callFunction} = require("@repo/kwe-lib/components/dbDTOHelper.ts");
import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import { checkAccount } from "@repo/kwe-lib/components/ldapHelper";
import { log, error } from '@repo/kwe-lib/components/logHelper';
import { dataContainer } from '@repo/kwe-lib/components/dataContainer';
// import { decode } from '@repo/kwe-lib/components/next-auth/jwt';
// import {decode} from '@auth/core/jwt';

export const createServer = (): Express => {

  let type;
  if (process.env.NODE_ENV === "production") {
    type = "combined";
  } else {
    type = "dev";
  }

  const app = express();  
  app
    .disable("x-powered-by")
    .use(morgan(type))
    .use(express.json({
      limit : "50mb"
    }))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(compression())
    .set('trust proxy', true)
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/logout", async (req, res) =>  {
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
    })
    .post('/api/data', async (req, res) => {
      try {

        const accessToken = req.headers['authorization'];
        // log(accessToken)
        if (!accessToken) {
          return res.status(401).json({ error: 'Access token not provided' });
        }
        
        try {
          const decoded = jwt.verify(accessToken, 'Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E=');
        } catch (err) {
          error("Authorize Error : ", err.message);
          let dc = new dataContainer(); 
          dc.setNumericData(-1);
          dc.setTextData("Authorize Error : "+ err.message);
          return res.json(dc);
        }
        
        const {inproc, inparam, invalue} = req.body;
        const result = await callFunction(inproc, inparam, invalue);
        // log(result)
        res.json(result);
      } catch (err) {
        log('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data : ' + err});
      }
    })
    .post('/login', async (req, res) =>  {
      log(req.body);
      const { user_id, password } = req.body;

      if (user_id === '') {
        return res.json({ success:false, message: 'Input ID', token:'', userData:'' })
      }

      await checkAccount(user_id, password, async (isAuthenticated:any, userObject:any, err:any) => {
        if (isAuthenticated) {
          // 세션에 사용자 정보 저장
          //req.session.user = userObject;
  
          // const token = jwt.sign({ userId: user_id }, 'secretKey', { expiresIn: '1d' });
          const token ='';
          
          const params = {
            inparam: ["in_user_id", "in_user_nm", "in_ipaddr"],
            invalue: [user_id, userObject, ''],
            inproc: 'public.f_admn_get_userauth'
          }
          let dc:any = new dataContainer(); 
          dc = await callFunction(params.inproc, params.inparam, params.invalue);  
          if (dc.getNumericData() === 0) {   
            // 인증 성공시 처리
            res.json({ success: true, message: 'Authentication successful', user_nm: userObject, userData:dc.getCursorData()[0].data, token : token });
          }
          else {
            res.json({ success:false, message: dc.getNumericData() + ' - ' + dc.getTextData(), token:'', userData: '' });
          }
        } else {
          // 인증 실패시 처리
          log("실패");
          //res.status(401).json({ success: true, message: 'Authentication failed' });
          res.json({ success:false, message: 'Authentication failed - ' + err, token:'', userData:'' })
        }
      })
    })
    .on('uncaughtException', function (err) {
      error('An error occurred: ', err);
    })
    ;

  return app;
};
