

const axios = require("axios");
const {AxiosResponse} = require("axios");
const ini = require("ini");
const { log, error } = require('./logHelper');

let axiosInstance = null;

const createAxiosInstance = () => {
    if (!axiosInstance) {
        axiosInstance = axios.create({
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return axiosInstance;
};

const initAPIService = async (config) => {
  const header = {'Authorization': `${config.token}`};
  let content_type = {};
  switch (config.type) {
      case "1": 
          content_type = {'Content-Type': 'application/json'}
          break;
      case "2": 
          content_type = {'Content-Type': 'multipart/form-data'}
          break;
  }

  const client = createAxiosInstance();
  client.defaults.baseURL = config.baseURL;
  client.defaults.headers = {
      ...client.defaults.headers,
      ...header,
      ...content_type
  };

  return client;
}

 async function init(configParam) {

  const config = {
    baseURL: configParam.url,
    headers: {
      "Content-Type": configParam.content_type ? configParam.content_type : "application/json",
      "Authorization": `${configParam.accessToken}`,
      // "X-Forwarded-Host": configParam.host
    },
    // withCredentials: configParam.isAuth ? true : false,
    // withCredentials: true
  }
  const client = axios.create(config);
  client.defaults.timeout = 30000;

  // 싱글톤으로 할 경우 client.interceptors 가 중복되어 isShowLoading이 제대로 안먹음
  // const client = createAxiosInstance();

  // /* 싱글톤으로 사용, front에서 createAxiosInstance 직접 호출 후 생성된 instance의 속성을 직접 세팅방식으로 변경 */
  // /* init을 사용하던 관련 코드드 변경 후 이 함수는 삭제 */
  // if (configParam.url) {
  //   client.defaults.baseURL = configParam.url;
  // }
  // if (configParam.accessToken) {
  //   client.defaults.headers = { ...client.defaults.headers, "Authorization": `${configParam.accessToken}`};
  // }
  // /************************************************/

  return client;
}

async function dataCall(client, inproc, inparam, invalue, config) {
  const maxRetries = 3;
  let retries = 0;

  try {
    // log("dataCall");
    const url = '/api/data';
    // const client = await init(config);
    const response = await client.post(url, {inproc, inparam, invalue}
                                    // , {timeout:60000}
                    );
    // log("-----------------", response)
    const { numericData, textData, cursorData } = response.data

    // log("dataCall:", numericData, textData)

    return {
      numericData: numericData,
      textData: textData,
      cursorData: cursorData
    }
    
  } catch (ex) {
      retries += 1;
      error('api.service-Error fetching data:', ex.message);

      if (retries >= maxRetries) {
        error('Max retries reached. Throwing error.');
        // throw new Error('Failed to fetch data after multiple attempts');
        return {
          numericData: -1,
          textData: ex.message,
          cursorData: null
        }
      }

      // 잠시 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 100));
  };
};

const postCall = async (params) => {
  
  try {
    // log("postCall params1 : ", params);  
    const {user_id, password, url, isShowLoading} = params;
    const client = await init(params);
    // const client = params.client;
    // log("postCall params2 : ", params);
    // const response = isShowLoading ? 
    //                       await client.post<AxiosResponse>(url, {user_id: user_id,password: password})
    //                     : await client.post(url, {user_id: user_id,password: password});

    const response = isShowLoading ? 
                          await client.post<AxiosResponse>(url, params)
                        : await client.post(url, params);

    // log("postCall params1 : ", response.data);

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

const responseBlobPostCall = async (params) => {
  try {
    const {url, isShowLoading} = params;
    const config = {
      baseURL: params.url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${params.accessToken}`,
      },
      responseType: 'blob'
    }
    const client = axios.create(config);
    client.defaults.timeout = 30000;

    const response = isShowLoading ? 
                          await client.post<AxiosResponse>(url, params)
                        : await client.post(url, params);
    return response;
  } catch (err) {
    return {
      data: {
        success: false,
        message: 'Cannot connect to server.. ' + err.name
      }
    }
  }
};

const apiCallPost = async (client, params) => {
  try {
    var result = await client.post(params.url, params);
    return result;
  } catch (ex) {
    return {
      data: {
        success: false,
        message: 'Cannot connect to server.. ' + ex
      }
    }
  }

}

const getCall = async (params) => {
  
  try {
    const client = axios.create();
    client.defaults.timeout = 10000;
    const response = await client.get(params.url);

    // log("postCall params1 : ", response.data);

    return response;
  } catch (err) {
    log("getCall err1 :", JSON.stringify(err));
    return err;
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
    baseURL: 'http://10.33.63.171:5000',
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
  getCall,
  createAxiosInstance,
  initAPIService,
  apiCallPost,
  responseBlobPostCall
}
