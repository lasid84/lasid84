

const axios = require('axios');
const { log, error } = require('./logHelper');

 async function init(configParam: { user_id?: any; password?: any; url: any; isShowLoading?: any; accessToken?: any; }) {

  const config = {
    baseURL: configParam.url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `${configParam.accessToken}`,
      // "X-Forwarded-Host": configParam.host
    },
    // withCredentials: configParam.isAuth ? true : false,
    // withCredentials: true
  }
  const client = axios.create(config);
  client.defaults.timeout = 30000;

  return client;
}

export async function dataCall(client: { post: (arg0: string, arg1: { inproc: any; inparam: any; invalue: any; }) => any; }, inproc: any, inparam: any, invalue: any, config: any) {
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
    
  } catch (ex:any) {
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

export const postCall = async (params: { user_id: any; password: any; url: any; isShowLoading: any; }) => {
  
  try {
    log("postCall params1 : ", params);  
    const {user_id, password, url, isShowLoading} = params;
    const client = await init(params);
    // const client = params.client;
    // log("postCall params2 : ", params);
    // const response = isShowLoading ? 
    //                       await client.post<AxiosResponse>(url, {user_id: user_id,password: password})
    //                     : await client.post(url, {user_id: user_id,password: password});

    const response = await client.post(url, params);

    // log("postCall params1 : ", response.data);

    return response;
  } catch (err : any) {
    log("postCall err1 :", JSON.stringify(err));
    return {
      data: {
        success: false,
        message: 'Cannot connect to server.. ' + err.name
      }
    }
  }
};

export const getCall = async (params: { url: any; }) => {
  
  try {
    log("postCall params1 : ", params); 
    const client = axios.create();
    client.defaults.timeout = 10000;
    const response = await client.get(params.url);

    // log("postCall params1 : ", response.data);

    return response;
  } catch (err:any) {
    log("getCall err1 :", JSON.stringify(err));
    return {
      data: {
        success: false,
        message: 'Cannot connect to server.. ' + err.name
      }
    }
  }
};

const openPopup = (message:any) => {
  try {
  // alert(message);
  console.log(message);
  } catch (err) {
    
  }
};
