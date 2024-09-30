// 'use server';

// import { signIn } from '@/app/api/auth/auth';
import { AuthError, User } from 'next-auth';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';
import { returnData, checkADLogin,  executFunction } from 'services/api.services';
// const { returnData, checkADLogin,  executFunction } = require('services/api.services');

import { handlers } from '@/app/api/auth/auth';

const { log } = require('@repo/kwe-lib/components/logHelper');
// const { postCall,  executFunction } = require("@repo/kwe-lib/components/api.service");


export type UserFormProps = {
  user_id: string;
  password: string;
};

export type LoginResponse = {
  data: any
  message: string
  success: boolean
}

export type userData = {
  user_id: string
  user_nm: string
}

export const getUserData = (async (userData:userData) => {
  noStore();
  try {

      const params = {
        inparam: ["in_user_id", "in_user_nm", "in_ipaddr"],
        invalue: [userData.user_id, userData.user_nm, ''],
        inproc: 'public.f_admn_get_userauth',
        isLoginPage: true
      }
      const cursorData:any = await executFunction(params);  
      // log("====", cursorData[0])
      if (cursorData !== null) {   
          return cursorData![0];
      }           
  } catch (err) {
    const typedErr = err as Error;
    // console.error('Error fetching data:', typedErr.message);
  } finally {

  };
});

export async function Login(
    formData: UserFormProps
  ) {
    try {
      const param = {
        url: "/login",
        user_id: formData.user_id,
        password: formData.password
      };
      console.log("?@@?")
      const {data} = await checkADLogin(param)
      if (!data.success) {
        return ({
          data: null,
          message: data.message, 
          success: false
        });
      }
      // const userData:any = await getUserData({user_id: formData.user_id, user_nm: data.user_nm});
      
      if (data.data !== null ) {
        await signIn('credentials', {
          ...data.userData[0],
          callbackUrl: "/",
          redirect:false
        });

        // localStorage.setItem("user_id", userData[0].user_id);

        return ({
          data: {...data.userData[0]},
          message: data.message, 
          success: true
        });
    }
      
    } catch (error:any) {
        log("server login : ", JSON.stringify(error.message));
    }
  }
