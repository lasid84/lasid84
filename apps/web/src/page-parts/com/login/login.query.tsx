// import ApiService from "@repo/kwe-lib/components/api.service";

// export const loginUser = async (params: any) => {
//   const  data  = await ApiService.post<any>("/login", {
//     user_id: params.user_id,
//     password: params.password,
//   });
//   return data;
// };

// export const saveUserConfig = async (params: any) => {
//   const { data } = await ApiService.post<any>("/sys-user-cfg/save", {
//     user_id: params.user_id,
//     cfg_key: params.cfg_key,
//     cfg_val: params.cfg_val,
//   });
//   return data;
// };

import {postCall2} from '@repo/kwe-lib/components/api.service';

import {log} from '@repo/kwe-lib/components/logHelper';

export const loginUser = async (params: any) => {
  params["url"] = "/login";
  const  data  = await postCall2(params);
  // const config = {
  //   ...params,
  //   url: "http://10.33.63.171:5000" + "/login"
  // }
  // const  data  = await postCall(config);
  log("data in login.query2", JSON.stringify(data))
  return data;
};

// export const saveUserConfig = async (params: any) => {
//   const { data } = await ApiService.post<any>("/sys-user-cfg/save", {
//     user_id: params.user_id,
//     cfg_key: params.cfg_key,
//     cfg_val: params.cfg_val,
//   });
//   return data;
// };