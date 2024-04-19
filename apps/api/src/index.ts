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
    log("process.cwd() : ", process.cwd())
    var iniData = ini.decode(await fs.readFile(process.cwd() + "/dist/configs/server.ini", "utf8"));
    port = objectPath.get(iniData, "main.port");
    // port = 5005;
    server.listen(port, () => {
      log(`api running on ${port}`);
    });
  } catch (err) {
    log("index ", err);
  }
}

init();