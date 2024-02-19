

const axios = require("axios");
const {AxiosResponse} = require("axios");
const ini = require("ini");
const { log } = require('./logHelper');
//const serverUrl = 'http://10.33.63.50:5005';
 const serverUrl = 'http://10.33.63.171:5000';

async function init(configParam) {

  // log("init : ", configParam);
  const config = {
    baseURL: configParam.url,
    headers: {"Content-Type": "application/json"},
    withCredentials: configParam.isAuth ? true : false,
  }

  const client = axios.create(config);

  client.defaults.timeout = 30000;

  // log("config : ",config);

  return client;
}

async function dataCall(inproc, inparam, invalue, config) {
  try {

    // var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    // var url = objectPath.get(iniData, "main.url");
    // const url = 'http://10.33.63.171:5000/api/data';
    const url = '/api/data';
    const client = await init(config);

    // log("info", config.isShowLoading, inproc, inparam, invalue);

    const response = await client.post(url, {inproc, inparam, invalue});

    // const response = config.isShowLoading ? 
    //                       await client.post<AxiosResponse>(url, {inproc, inparam, invalue})
    //                     : await client.post(url, {inproc, inparam, invalue})

    // log("call finish", JSON.stringify(response.data));
    const { numericData, textData, cursorData } = response.data
    // // log("start api service", numericData)
    // if (numericData !== 0)
    // {
    //   openPopup(numericData + " : " +  textData);
    //   throw new Error(textData);
    //   return null;
    // }

    return {
      numericData: numericData,
      textData: textData,
      cursorData: cursorData
    }
    
  } catch (error) {
    console.error('api.service-Error fetching data:', error.message);
    return {
      numericData: -1,
      textData: error.message,
      cursorData: null
    }
  };
};

const postCall = async (params) => {
  
  try {
    // log("postCall params1 : ", params);  
    const {user_id, password, url, isShowLoading} = params;
    const client = await init(params);
    // log("postCall params2 : ", params);
    const response = isShowLoading ? 
                          await client.post<AxiosResponse>(url, {user_id: user_id,password: password})
                        : await client.post(url, {user_id: user_id,password: password});

    // log("postCall", data);
    // log("postCall", url, params.user_id, params.password);
    return response;
  } catch (err) {
    log("postCall err1 :", JSON.stringify(err));
    return {
      data: {
        success: false,
        message: err.name
      }
    }
  }
};

const openPopup = (message) => {
  try {
  // alert(message);
  console.log(message);
  } catch (err) {
    
  }
};



async function init2() {

  const client = axios.create({
    baseURL: serverUrl,
  });

  client.defaults.timeout = 30000;

  return client;
}

async function executFunction(inproc, inparam, invalue) {
  try {

    // var iniData = ini.decode(await fs.readFile(process.cwd() + "/configs/server.ini", "utf8"));
    // var url = objectPath.get(iniData, "main.url");
    // const url = 'http://10.33.63.171:5000/api/data';
    const url = '/api/data';
    const client = await init2();
    // log("url", url);
    // log("info", inproc, inparam, invalue);
    const response = await client.post(url, {inproc, inparam, invalue});

    // log("call finish", JSON.stringify(response.data));
    const { numericData, textData, cursorData } = response.data
    // log("start api service", numericData)
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

const postCall2 = async (params) => {
  
  // const url = serverUrl + params.url;
  
  const url = params.url;
  const client = await init2();
  const data  = await client.post(url, {
    user_id: params.user_id,
    password: params.password,
  });

  // log("postCall", data);
  log("postCall", url, params);
  return data;
};


module.exports = {
  executFunction,
  dataCall,
  postCall,
  postCall2
}

