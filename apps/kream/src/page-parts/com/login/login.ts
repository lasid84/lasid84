'use server';

import { signIn } from '@/app/api/auth/auth';
import { AuthError, User } from 'next-auth';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

const { log } = require('@repo/kwe-lib/components/logHelper');
const { postCall,  executFunction } = require("@repo/kwe-lib/components/api.service");

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

      log("getUserData", userData);

      const inparam = ["in_user_id", "in_user_nm", "in_ipaddr"];
      // const invalue = [data.user_id, data.user_nm, data.ipaddr];
      const invalue = [userData.user_id, userData.user_nm, ''];
      const inproc = 'public.f_admn_get_userauth'; 
      const cursorData = await executFunction(inproc,inparam, invalue);  
      
      log("========================cursorData", cursorData);
      if (cursorData !== null) {   
          return cursorData[0];
      }           
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {

  };
});

export async function authenticate(
    prevState: {},
    // formData: FormData
    formData: {user_id:string, password:string, redirect:boolean}
  ) {
    try {

      log("action의 authenticate 시작", formData);
      
      // await signIn('credentials', {
      //   user_id:formData.get('user_id'),
      //   password:formData.get('password'),
      //   redirect:false
      // });

      await signIn('credentials', {
        user_id:formData.user_id,
        password:formData.password,
        redirect:formData.redirect
      });
      
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              ...prevState,
              success:false,
              message:'Invalid credentials.',
              user_id: '',
              user_nm:''
          };
          // return 'Invalid credentials.2';
          default:
            // {
            //   return {
            //     success: false,
            //     message:'Something went wrong.2',
            //   };
            return {
              ...prevState,
              success:false,
              message:'Something went wrong.',
              user_id: '',
              user_nm:''
          };
              // return 'Something went wrong.2';
          // }
        }
      }
      throw error;
    }
  }

  export async function Login(
    formData: UserFormProps
  ) {
    try {

      log("action의 authenticate 시작", formData);

      const param = {
        url: "/login",
        user_id: formData.user_id,
        password: formData.password
      };
      const {data} = await postCall(param)

      if (!data.success) {
        return ({
          data: null,
          message: data.message, 
          success: false
        });
      }
      
      const userData:any = await getUserData({user_id: formData.user_id, user_nm: data.user_nm});
      

      await signIn('credentials', {
        ...userData[0],
        redirect:false
      });

      return ({
        data: {...userData[0]},
        message: data.message, 
        success: true
      });
      
    } catch (error) {
        log("server login : ", JSON.stringify(error), "==========================");
    }
  }
