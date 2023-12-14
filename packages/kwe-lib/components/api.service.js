const axios = require("axios");
// import { log, ini, objectPath, fs } from "../src/index";
const ini = require("ini");
const objectPath = require("object-path");
const fs = require("fs").promises;
// const { log } = require('@repo/kwe-lib/components/logHelper');


async function executFunction(inproc, inparam, invalue) {
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

const openPopup = (message) => {
  alert(message);
  console.log(message);
};


module.exports = executFunction;
