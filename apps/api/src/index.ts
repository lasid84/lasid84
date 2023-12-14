const { log, ini, objectPath, fs } = require("@repo/kwe-lib");
// const ini = require("ini");
// const fs = require("fs");
// const objectPath = require("objectPath");
//import { createServer } from './server.js';
const {createServer} = require("./server.ts");

//var path: string = process.cwd();

//var port = process.env.PORT || 5001;
async function init () {
  try {
    var port = 0;
    const server = createServer();

    var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    port = objectPath.get(iniData, "main.port");
    // port = 5005;
    server.listen(port, () => {
      log(`api running on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

init();