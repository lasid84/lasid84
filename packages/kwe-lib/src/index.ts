// const callFunction = require("../components/dbDTOHelper2.js");
// const executFunction = require("../components/api.service.ts");
// const checkAccount = require("../components/ldapHelper.ts");
// const sleep = require("../components/sleep.ts");
export const ini = require("ini");
export const objectPath = require("object-path");
export const fs = require("fs").promises;
export const path = require("path");
// import { path as arp } from 'app-root-path'
export const rfs = require('rotating-file-stream')

export { path as arp } from 'app-root-path';

export const { signJwtAccessToken, verifyJwt } = require('../components/jsonWebToken');

// export {executFunction} from '../components/api.service2';
// const homedir = require("os");
// export callFunction = require("../components/dbDTOHelper.ts")

// const log = (...args: unknown[]): void => {
//     // eslint-disable-next-line no-console -- logger
//     const production = process.env.NODE_ENV === 'production';
//     const development = process.env.NODE_ENV === 'development';

//     // development && console.log("LOGGER: ", ...args);
//     console.log("LOGGER: ", ...args);
//   };

// const callFunction = () => {
//   const callFunction = require("../components/dbDTOHelper.ts");
//   return callFunction;
// }

// export {log, callFunction, executFunction, checkAccount, sleep
//       , ini, objectPath, fs, path, homedir, arp
// }

// export = {
//     path, arp, ini, objectPath, fs
// }
