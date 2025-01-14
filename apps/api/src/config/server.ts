import { Express, json } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import fileUpload from 'express-fileupload';

/**
 * @dev
 * Express Server Config
 * 1. compression
 * : Compression data on network
 * 2. urlencoded
 * : Use qs module
 * 3. json
 * : Input data to req.body & Data limit is 50mb
 * 4. helmet
 * : Prevent csp, HSTS attack
 * 5. json()
 * : Use json javascript object
 * 6. cors
 * : Prevent cors problem
 * 7.trust proxy
 * : setting of proxy server
 */
export default function serverConfig(app: Express) {
  app
    .use(compression())

    .use(bodyParser.urlencoded({ extended: true }))

    .use(bodyParser.json({ limit: "100mb" }))

    .use(bodyParser.text({ type: 'application/xml' }))

    .use(helmet())

    .use(json())

    // .use(cors())

    .use(cors({
      origin: 'http://localhost:3000',  // 허용할 클라이언트 출처 명시
      credentials: true,                // 자격 증명 허용
    }))

    .use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }}))

    .set("trust proxy", true)

    .disable("x-powered-by");
}
