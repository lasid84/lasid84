import { json, urlencoded } from "body-parser";
import express, { type Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import jwt from 'jsonwebtoken';
import compression from "compression";

import { callFunction } from "@repo/kwe-lib/components/dbDTOHelper";
import { checkAccount } from "@repo/kwe-lib/components/ldapHelper";
import { log, error } from '@repo/kwe-lib/components/logHelper';
import { dataContainer } from '@repo/kwe-lib/components/dataContainer';
import { path, rfs } from "@repo/kwe-lib";



export const createServer = (): Express => {

  let type;
  if (process.env.NODE_ENV.trim().includes("production")) {
    type = "combined";
  } else {
    type = "dev";
  }

  const app = express();  

  const corsOptions = {
    origin: 'http://dev-kream.web.kwe.co.kr', // 허용할 출처
    methods: ['GET','POST','PUT','DELETE','OPTIONS'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type','Authorization','X-Forwarded-Host'], // 허용할 헤더
    credentials: true // 인증 정보를 포함할 경우 허용
  }; 

  const loginLogStream = rfs.createStream((time, index) => {
    if (!time) return 'login.log';
    const year = time.getFullYear();
    const month = (`0${time.getMonth() + 1}`).slice(-2);
    const day = (`0${time.getDate()}`).slice(-2);
    return `login-${year}-${month}-${day}.log`;
  }, {
    interval: '1d', // 일자별 회전
    path: path.join(__dirname, 'log')
  });

  // Custom Morgan Token for user_id
  morgan.token('user_id', (req: Request) => {
    return req.body.user_id || 'unknown';
  });

  morgan.token('user_nm', (req: Request & { user_nm?: string }) => {
    return req.user_nm || '';
  });

  app
    .disable("x-powered-by")
    // .use(morgan(type))
    .use(express.json({
      limit : "50mb"
    }))
    .use(urlencoded({ extended: true }))
    .use(json())
    // .use(cors(
    //   // {
    //   //   origin: 'http://dev-kream.web.kwe.co.kr', // 프론트엔드가 실행되는 주소
    //   //   credentials: true, // 쿠키 허용
    //   // }
    // ))
    .use(cors(corsOptions))
    .options('*', cors())
    .use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://dev-kream.web.kwe.co.kr');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-Host'); // 여기에 'X-Forwarded-Host' 추가
       res.header('Access-Control-Allow-Credentials', 'true');
    // 프리플라이트 요청에 대한 응답
      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
      } else {
        next();
      }
    })    
    .options('/login', (req, res) => {
      res.header('Access-Control-Allow-Origin', 'http://dev-kream.web.kwe.co.kr');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-Host');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.sendStatus(204); // No Content
    })
    .options('/api/data', (req, res) => {
      res.header('Access-Control-Allow-Origin', 'http://dev-kream.web.kwe.co.kr');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-Host');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.sendStatus(204); // No Content
    })    
    .use(compression())
    // // Axios User-Agent를 가진 요청을 걸러내는 미들웨어
    // .use((req, res, next) => {
    //   log("Axios User-Agent를 가진 요청을 걸러내는 미들웨어", req.headers)
    //   if (req.headers['user-agent'] && req.headers['user-agent'].startsWith('axios/')) {
    //       log("Axios User-Agent를 가진 요청을 걸러내는 미들웨어2", req.headers)
    //       // Axios User-Agent인 경우, 로그를 기록하지 않음
    //       return res.status(404).end();
    //   }
    //   next();
    // })
    .set('trust proxy', true)
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/logout", async (req, res) =>  {
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
        } catch (ex) {
          
        }
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
    .post('/api/limo/data', async (req, res) => {
      //2024.05.31 WMS 연동용 API
      log("start")
      try {

        const accessToken = req.headers['authorization'];
        // log(accessToken, req.body)
        if (!accessToken) {
          return res.status(401).json({ error: 'Access token not provided' });
        }
        
        try {
          const decoded = jwt.verify(accessToken, 'c61dYZS9QNRbJ2LDtGpNQ0I3dcfxpH6Z9orOeyMuZG8=');
          // log("decode", decoded)
        } catch (err) {
          error("Authorize Error : ", err.message);
          let dc = new dataContainer(); 
          dc.setNumericData(-1);
          dc.setTextData("Authorize Error : "+ err.message);
          return res.json(dc);
        }
        
        const {inproc, inparam, invalue} = req.body;
        
        if (inproc.split('.')[0].toLowerCase() !== 'limo') {
          return res.status(500).json({ error: 'LIMO 스키마 외 권한이 없습니다.'});  
        }

        const result = await callFunction(inproc, inparam, invalue);
        // log(result)
        res.json(result);
      } catch (err) {
        log('WMS API Error fetching data:', err);
        res.status(500).json({ error: 'WMS API Error fetching data : ' + err});
      }
    })
    // .use('/login', morgan(`${}`))
    .post('/login', async (req: Request & { user_nm?: string }, res, next) =>  {
      try {
      //패스워드 암호처리, 복구 필요
      // log("========",req);
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
            req.user_nm = userObject;
            // 인증 성공시 처리
            res.json({ success: true, message: 'Authentication successful', user_nm: userObject, userData:dc.getCursorData()[0].data, token : token });
          }
          else {
            req.user_nm = 'Invalid Credentials';
            res.json({ success:false, message: dc.getNumericData() + ' - ' + dc.getTextData(), token:'', userData: '' });
          }
        } else {
          // 인증 실패시 처리
          log("실패");
          //res.status(401).json({ success: true, message: 'Authentication failed' });
          res.json({ success:false, message: 'Authentication failed - ' + err, token:'', userData:'' })
        }
      })
      next();
    } catch (ex) {
      error("/login", ex.message);
    }}, morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms :user_id :user_nm'
      , { stream: loginLogStream }), (req, res) => {
      // res.send('Login endpoint accessed');
    })
    .on('uncaughtException', function (err) {
      error('An error occurred: ', err);
    })
    ;

  return app;
};
