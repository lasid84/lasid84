import express, { Express } from 'express';
import serverConfig from './config/server';
import setupRoutes from './router';

const app : Express = express();

/**
 * @dev
 * Express Server Config
 */
serverConfig(app);

/**
 * @dev
 * env 설정 추가 예정
 * Directory : helpers/dev
 */

/**
 * @dev
 * log 설정 추가 예정
 * Directory : helpers/log
 */

/**
 * @dev
 * DB 설정 추가 예정
 * Directory : helpers/database
 */

/**
 * @dev
 * Setting routes of API 
 */
setupRoutes(app);

/**
 * @dev
 * Port env 설정으로 이관 예정
 */
const port = 9000;

app.listen(port, () => {
    console.log("server start");
});