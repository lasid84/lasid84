
const { init, dataCall } = require('@repo/kwe-lib/components/api.service.js');
const { ini, objectPath, fs } = require("@repo/kwe-lib");
const { signJwtAccessToken } = require('@repo/kwe-lib/components/jsonWebToken.js');
const { log, error } = require('@repo/kwe-lib/components/logHelper');

// import { init, dataCall } from '@repo/kwe-lib/components/api.service';
// import { ini, objectPath, fs } from "@repo/kwe-lib";
// import { signJwtAccessToken } from '@repo/kwe-lib/components/jsonWebToken';
// import { log, error } from '@repo/kwe-lib/components/logHelper';

var iniData;
var url;
var token;

async function initService() {
    
    //개발서버에서는 /dist까지 나와서 임시로 아래와 같이 설정 - stephen
    let root = process.cwd();
    if (root.endsWith("/dist")) root = root.replace("/dist", "");

    if (!url) {
        //batch 프로젝트는 process.cwd() : /home/sdd_it/kream_web/apps/batch/dist 임.. 왜 api랑 다른지 모르겠음
        iniData = ini.decode(await fs.readFile(root + "/dist/configs/server.ini", "utf8"));
        url = objectPath.get(iniData, "main.url");
        // error("initService", url, token, iniData);
    }
}

async function executFunction(inproc, inparam, invalue) {
    await initService();
    token = signJwtAccessToken({user_id:"sdd_it", user_nm:"SDD"});
    const client = await init({url:url, isAuth:false, accessToken:token});
    
    // log("executFunction1", iniData, url, token);
    const { cursorData, numericData, textData } = await dataCall(client, inproc,inparam, invalue,'');

    // log("============executFunction2", url, inproc,inparam, invalue, numericData, textData, cursorData);
    if (numericData !== 0)
    {
        let errMsg = numericData + " : " +  textData;
    //   log(errMsg);
      throw new Error(errMsg);
    }

    return cursorData;
}

module.exports = { executFunction }