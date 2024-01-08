const axios = require("axios");
import { ini, objectPath, fs } from "../src/index.ts";

async function executFunction(inproc:any, inparam:any, invalue:any) {
  try {

    var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    var url = objectPath.get(iniData, "main.url");

    // var config = new Config("/configs/server.ini");
    // await config.load();
    // const url = config.get("main.url");
    const response = await axios.post(url, {inproc, inparam, invalue});
    //console.log(response.data);
    const { numericData, textData, cursorData } = response.data

    if (numericData !== 0)
    {
      openPopup(numericData + " : " +  textData);
      throw new Error(textData);
      return null;
    }

    return cursorData;
    
  } catch (error) {
    console.error('Error fetching data:', error);
  };
};

const openPopup = (message:string) => {
  alert(message);
  console.log(message);
};


module.exports = executFunction;
