// const { ini, objectPath, fs } = require("@repo/kwe-lib");
// const { log } = require("@repo/kwe-lib/components/logHelper");
import { ini, objectPath, fs } from "@repo/kwe-lib";
import { log } from "@repo/kwe-lib/components/logHelper";
// const ini = require("ini");
// const fs = require("fs");
// const objectPath = require("objectPath");
import { createServer } from './server.ts';
// const {createServer} = require("./server.ts");

//var path: string = process.cwd();

//var port = process.env.PORT || 5001;
async function init () {
  var server;
  try {
    var port = 0;
    server = createServer();

    var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    port = objectPath.get(iniData, "main.port");
    // port = 5005;
    log(`??`, port);
    server.listen(port, () => {
      log(`api running on ${port}`);
    });
  } catch (err) {
    log("index ", err);
  }
}

init();