import { json, urlencoded } from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
const jwt = require('jsonwebtoken');
import compression from "compression";
//import {log, callFunction, checkAccount} from "@repo/kwe-lib";
//import {callFunction} from "@repo/kwe-lib";
// import {callFunction} from "@repo/kwe-lib/components/dbDTOHelper";
// const {callFunction} = require("@repo/kwe-lib/components/dbDTOHelper.ts");
import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import { checkAccount } from "@repo/kwe-lib/components/ldapHelper";
import { log } from '@repo/kwe-lib/components/logHelper';

export const createServer = () => {

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
        const {inproc, inparam, invalue} = req.body;
        const result = await callFunction(inproc, inparam, invalue);
        res.json(result);
      } catch (err) {
        console.log('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data : ' + err});
      }
    })
    .post('/login', async (req, res) =>  {
      const { user_id, password } = req.body;
      await checkAccount(user_id, password, (isAuthenticated, userObject) => {
        if (isAuthenticated) {
          log("userObject:",userObject);
          // 세션에 사용자 정보 저장
          //req.session.user = userObject;
  
          const token = jwt.sign({ userId: user_id }, 'secretKey', { expiresIn: '1h' });
  
          // 인증 성공시 처리
          res.json({ success: true, message: 'Authentication successful', user_nm: userObject, token : token });
        } else {
          // 인증 실패시 처리
          log("실패");
          //res.status(401).json({ success: true, message: 'Authentication failed' });
          res.json({ success:false, message: userObject, token:'' })
        }
      })
    })
    .on('uncaughtException', function (err) {
      console.log('An error occurred: ', err);
      console.log(err.stack);
    })
    ;

  return app;
};
