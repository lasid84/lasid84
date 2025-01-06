import express from "express";
import serverConfig from "./config/server";
import setupRoutes from "./router";

import loggerMiddleware from "./helpers/log/logger";

import dotenv from 'dotenv';
dotenv.config();

const { log } = require('@repo/kwe-lib/components/logHelper');

const ipv4 = "0.0.0.0";

const app: express.Express = express();

/**
 * @dev
 * Express Server Config
 */
serverConfig(app);

/**
 * TODO
 * env 설정 추가 예정
 * Directory : helpers/dev
 */

/**
 * @dev
 * Setting Logger Middleware
 * (Request, Response Logging)
 */
app.use(loggerMiddleware);

/**
 * TODO
 * DB 설정 추가 예정
 * Directory : helpers/database
 */

/**
 * @dev
 * Setting routes of API
 */
setupRoutes(app);

/**
 * TODO
 * Port env 설정으로 이관 예정
 */
const port = Number(process.env.PORT);

app.listen(port, ipv4, () => {
  log("server start port : ", port);
});
