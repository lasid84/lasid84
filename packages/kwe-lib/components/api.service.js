const axios = require("axios");
// import { log, ini, objectPath, fs } from "../src/index";
const ini = require("ini");
// const objectPath = require("object-path");
// const fs = require("fs");
const { log } = require('./logHelper');
//const serverUrl = 'http://10.33.63.50:5005';
const serverUrl = 'http://10.33.63.171:5000';

async function executFunction(inproc, inparam, invalue) {
  try {

    // var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    // var url = objectPath.get(iniData, "main.url");
    // const url = 'http://10.33.63.171:5000/api/data';
    const url = serverUrl + '/api/data';
    log("url", url);
    log("info", inproc, inparam, invalue);
    const response = await axios.post(url, {inproc, inparam, invalue});
    log("call finish");
    const { numericData, textData, cursorData } = response.data
    log("start api service")
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

const postCall = async (params) => {
  
  const url = serverUrl + params.url;
  log("params", params);
  const  data  = await axios.post(url, {
    user_id: params.user_id,
    password: params.password,
  })
  .then(function (response) {
    self.close();
  })
  ;
  return data;
};

const openPopup = (message) => {
  try {
  alert(message);
  console.log(message);
  } catch (err) {
    
  }
};


module.exports = {
  executFunction,
  postCall
}
