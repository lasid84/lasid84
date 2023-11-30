import { log, ini, objectPath, fs } from "utils";
import { createServer } from "./server";

var path: string = process.cwd();

//var port = process.env.PORT || 5001;
async function init () {

  var port = 0;
  const server = createServer();

  var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
  port = objectPath.get(iniData, "main.port");

  server.listen(port, () => {
    log(`api running on ${port}`);
  });
}

init();