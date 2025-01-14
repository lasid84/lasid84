// 'use server';
'use client'

// import { signIn } from '@/app/api/auth/auth';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

import { checkADLogin, executeKREAMFunction } from '@/services/api/apiClient';
import { log } from '@repo/kwe-lib-new';


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
      const cursorData:any = await executeKREAMFunction(params);  
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
      const response = await checkADLogin(param)
      const { data, headers} = response;

      if (!data.success) {
        return ({
          data: null,
          message: data.message, 
          success: false
        });
      }
      if (data.data !== null ) {
        await signIn('credentials', {
          ...data.userData[0],
          callbackUrl: "/",
          redirect:false
        });

        const token = data['KREAMToken'];
        localStorage.setItem('KREAMToken', token);

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
