

const axios = require("axios");
const {AxiosResponse} = require("axios");
const ini = require("ini");
const { log, error } = require('./logHelper');
//const serverUrl = 'http://10.33.63.50:5005';
 const serverUrl = 'http://10.33.63.171:5000';

 async function init(configParam) {

  const config = {
    baseURL: configParam.url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `${configParam.accessToken}`,
      "X-Forwarded-Host": configParam.host
    },
    // withCredentials: configParam.isAuth ? true : false,
    // withCredentials: true
  }
  const client = axios.create(config);
  client.defaults.timeout = 30000;

  return client;
}

async function dataCall(client, inproc, inparam, invalue, config) {
  try {
    // log("dataCall");
    const url = '/api/data';
    // const client = await init(config);
    const response = await client.post(url, {inproc, inparam, invalue});
    // log("-----------------", response)
    const { numericData, textData, cursorData } = response.data

    // log("dataCall:", numericData, textData)

    return {
      numericData: numericData,
      textData: textData,
      cursorData: cursorData
    }
    
  } catch (ex) {
    error('api.service-Error fetching data:', ex.message);
    return {
      numericData: -1,
      textData: ex.message,
      cursorData: null
    }
  };
};

const postCall = async (params) => {
  
  try {
    log("postCall params1 : ", params);  
    const {user_id, password, url, isShowLoading} = params;
    const client = await init(params);
    // const client = params.client;
    log("postCall params2 : ", params);
    const response = isShowLoading ? 
                          await client.post<AxiosResponse>(url, {user_id: user_id,password: password})
                        : await client.post(url, {user_id: user_id,password: password});

    log("postCall params1 : ", response.data);

    return response;
  } catch (err) {
    log("postCall err1 :", JSON.stringify(err));
    return {
      data: {
        success: false,
        message: 'Cannot connect to server.. ' + err.name
      }
    }
  }
};

// const UFSPpostCall = async () => {
  
//   try {

//     const url = 'https://uat.ufsplus.kwe.com/auth/login/submit/';
//     const data = {
//       userId: 'ghlim5501',
//       password: '1q2w#E$R',
//       APP: 'TED'
//     };
//     const headers = {
//       'Content-Type': 'application/json',
//       'Host': new URL(url).host
//     };

//     return axios.post(url, data, { headers })
//         .then(response => {
//           // console.log('Status:', response.status);
//           // console.log('Headers:', response.headers);
//           // console.log('Data:', response.data);
//           return response;
//         })
//         .catch(error => {
//           console.error('Error:', error);
//         });

        

//   } catch (err) {
//     log("postCall err1 :", JSON.stringify(err));
//     return {
//       data: {
//         success: false,
//         message: 'Cannot connect to server.. ' + err.name
//       }
//     }
//   }
// };

const openPopup = (message) => {
  try {
  // alert(message);
  console.log(message);
  } catch (err) {
    
  }
};


/*아래는 구버전(web) 용********************/
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
    
  } catch (ex) {
    error('api.service-Error fetching data:', ex);
    return {
      numericData: -1,
      textData: ex.message,
      cursorData: null
    }
  };
};

const postCall2 = async (params) => {
  
  const url = params.url;
  const client = await init2();
  const data  = await client.post(url, {
    user_id: params.user_id,
    password: params.password,
  });

  // log("postCall", data);
  // log("postCall", url, params);
  return data;
};


module.exports = {
  init,
  executFunction,
  dataCall,
  postCall,
  postCall2,
  // UFSPpostCall
}
