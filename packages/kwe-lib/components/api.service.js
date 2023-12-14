const axios = require("axios");
// import { log, ini, objectPath, fs } from "../src/index";
const ini = require("ini");
const objectPath = require("object-path");
const fs = require("fs").promises;
const { log } = require('./logHelper');


async function executFunction(inproc, inparam, invalue) {
  try {

    var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    var url = objectPath.get(iniData, "main.url");
    const response = await axios.post(url, {inproc, inparam, invalue});
    const { numericData, textData, cursorData } = response.data

    if (numericData !== 0)
    {
      openPopup(numericData + " : " +  textData);
      throw new Error(textData);
      return null;
    }

    return cursorData;
    
  } catch (error) {
    console.error('api.service-Error fetching data:', error);
  };
};

const openPopup = (message) => {
  try {
  alert(message);
  console.log(message);
  } catch (err) {
    
  }
};


module.exports = {
  executFunction
}
