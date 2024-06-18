// const { ini, objectPath, fs } = require("@repo/kwe-lib");
import { ini, objectPath, fs } from "@repo/kwe-lib";
// const { log } = require("@repo/kwe-lib/components/logHelper");
import { log } from "@repo/kwe-lib/components/logHelper";
import { createServer } from './server.ts';

//var path: string = process.cwd();

async function init () {
  var server;
  try {
    var port = 0;

    server = createServer();
    var iniData = ini.decode(await fs.readFile(process.cwd() + "/dist/configs/server.ini", "utf8"));
    port = objectPath.get(iniData, "main.port");
    // port = 5005;

    /****************************************************************/
    /* 서버 NGINX 에서 인증서 관리로 아래 설정 주석 처리
    // SSL 인증서 및 비밀 키 파일 경로
    // const options = {
    //   key: await fs.readFile(path.resolve(__dirname, 'server.key')),
    //   cert: await fs.readFile(path.resolve(__dirname, 'server.cert')),
    // };
    // // HTTPS 서버 생성 및 실행
    // https.createServer(options, server).listen(port, () => {
    //   log(`HTTPS Server running on port ${port}`);
    // }); 
    /****************************************************************/

    server.listen(port, () => {
      log(`API Server running on port ${port}`);
    });
  } catch (err) {
    log("index ", err);
  }
}

init();