import { Express, json } from 'express';
import compression from "compression";
import bodyParser from "body-parser";
import helmet from 'helmet';
import cors from 'cors';

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
export default function serverConfig(app : Express) {
    app
    .use(compression())

    .use(bodyParser.urlencoded({ extended: true }))

    .use(bodyParser.json({ limit: '50mb' }))

    .use(helmet())

    .use(json())

    .use(cors())

    .set('trust proxy', true)

    .disable("x-powered-by")
}