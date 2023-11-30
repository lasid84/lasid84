const callFunction = require("../components/dbDTOHelper.ts");
const executFunction = require("../components/api.service.ts");
const checkAccount = require("../components/ldapHelper.ts");
const sleep = require("../components/sleep.ts");
const ini = require("ini");
const objectPath = require("object-path");
const fs = require("fs").promises;

const log = (...args: unknown[]): void => {
    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV === 'production';
    const development = process.env.NODE_ENV === 'development';

    development && console.log("LOGGER: ", ...args);
  };

export {log, callFunction, executFunction, checkAccount, sleep
      , ini, objectPath, fs
}
