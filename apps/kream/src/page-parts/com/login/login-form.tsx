"use client";

import { useState, useEffect, useLayoutEffect, FormEventHandler, ChangeEventHandler } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm, UseFormHandleSubmit } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { Input } from "components/react-hook-form/input";

import { useStore } from "utils/zustand";
import { useUserSettings } from "states/useUserSettings";
import { useNavigation, setNavigationData } from "states/useNavigation";
import { useConfigs } from "states/useConfigs";

import { auth } from '@/auth';
import {getSession, signIn, signOut} from "next-auth/react";
import { Login } from "@/page-parts/com/login/login";

import { authenticate } from '@/page-parts/com/login/login';
import { AuthError } from "next-auth";
const { executFunction } = require('@repo/kwe-lib/components/api.service');

const { log } = require('@repo/kwe-lib/components/logHelper');

export type FormProps = {
    user_id: string;
    password: string;
  };

const initialState = {
    success: false,
    message: '',
    user_id: '',
    user_nm:''
  };

export default function LoginForm() {

    // const [LoginState, dispatch] = useFormState(authenticate, initialState);

    // const [id, setId] = useState('');
    // const [name, setName] = useState('');
    // const [password, setPassword] = useState('');
    // const [userData, setUserData] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    // const {data:session, update, status} = useSession();
    // const [ipAddress, setIPAddress] = useState('Web');
    // const isUser = !!session?.user
    const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
    
    const router = useRouter();
  
    const methods = useForm<FormProps>({
      defaultValues: {
        user_id: "",
        password: "",
      },
    });
    const {
      handleSubmit,
      reset,
      formState: { errors },
    } = methods;

    // useEffect(() => {
    //   console.log(status, status === 'authenticated', isUser);
    //   if (status === 'loading') return;

    //   if (isUser) {
    //     () => setUser();
    //     router.replace("/dashboard");
    //   };
    // }, [isUser, status])

    // useLayoutEffect(() => {
    //   console.log(status, status === 'authenticated');
    //   if (status === 'authenticated') {
        
    //     setUser();
    //   };

    // }, [status] );

    // useEffect(() => {
    //   console.log(userData);
    //   // userSettingsActions!.setData({ ...userData });
    //   // userSettingsActions!.setData({ user_id: userData[0]?.user_id as string });
    //   // router.replace('/dashboard');
    // }, [userData])
  
    const onSubmit = async (user: FormProps) => {
      // e.preventDefault();

      // await signIn('credentials', {
      //   username: id,
      //   password,
      //   redirect: false,
      // });
      try {

          const res = await Login({user_id:user.user_id, password:user.password});

          if (!res!.success) {
            setErrMessage(res?.message);
            return;
          };

          setErrMessage('');

          userSettingsActions!.setData({ ...res?.data });
          router.replace('/');
      } catch (err) {
        setErrMessage(JSON.stringify(err));
        return;
      }



      // // const userData = await getUserData({user_id: user.user_id, user_nm:data.user_nm, ipaddr:'1.1.1.1'})
      // // const userData = await getUserData();
      // const session = await getSession();

      // // console.log("================ ", JSON.stringify(userData));
      // userSettingsActions!.setData({ ...session?.user });
      // // await setNavigationData();
      
      // router.replace('/');
    };

    // const onSubmit = async (user: FormProps) => {
    //   // e.preventDefault();

    //   try {

    //     console.log("onsubmi 시작");

    //     const res = await authenticate("credentials", {
    //       user_id: user.user_id,
    //       password : user.password,
    //       redirect: true,
    //     });       
        
    //     console.log(await session?.user);

    //     // if (res?.error) {
    //     //   switch (res.error) {
    //     //     case 'CredentialsSignin':
    //     //       setErrMessage('Invalid credentials.');
    //     //       break;
    //     //     default:
    //     //       setErrMessage('Something went wrong.');
    //     //       break;
    //     //   }
    //     //   return;
    //     // }
    //     setErrMessage('');
    //   } catch (err) {
    //     console.log("err", err);
    //     setErrMessage(JSON.stringify(err));
    //   }
    // };



    // const setUser = async () => {
    //   try {
    //     // update();
    //     // console.log("login-form:: res.user =====> ", session!.user.email, session?.user.name, status);
        
    //     // const user = {
    //     //   user_id : session!.user.email,
    //     //   user_nm : session?.user.name,
    //     //   ipaddr : ipAddress
    //     // }
        
    //     const userData = await getUserData();

    //     console.log("setUser", userData)
          
    //     userSettingsActions!.setData({ ...userData[0] });
          
    //     //  userSettingsActions!.setData({ user_id: userData[0].user_id });
    //     //  userSettingsActions!.setData({ user_name: userData[0].user_nm });
    //     //  userSettingsActions!.setData({ permission_id: userData[0].permission_id });
    //     //  userSettingsActions!.setData({ user_grp_id: userData[0].user_grp_id });
    //     //  userSettingsActions!.setData({ office_cd: userData[0].office_cd });
    //     //  userSettingsActions!.setData({ dept_cd: userData[0].dept_cd });
    //     //  userSettingsActions!.setData({ trans_mode: userData[0].trans_mode });
    //     //  userSettingsActions!.setData({ trans_type: userData[0].trans_type });
  
    //      //ip 추가
    //     //  userSettingsActions!.setData({ ufs_id: userData[0].ufs_id });
    //     // 정상적인 로직처리
        
    //      router.replace('/dashboard');
    //   } 
    //   catch (error) {
    //     console.log("error api service", error);
    //     // if (axios.isAxiosError(error)) {
    //     //   // user_id, password not found!
    //     //   if (error.response?.status === 404) {
    //     //     toastError(error.response.data.message);
    //     //   }
    //     // } else {
    //     //   console.log(error);
    //     // }
    //     // return;
    //   }
    // }

    // const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    //   setId(e.target.value);
    // };
  
    // const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    //   setPassword(e.target.value);
    // };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* <form onSubmit={onSubmit} className="space-y-6"> */}
      {/* <form action={dispatch} className="space-y-6"> */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="email">UserId</Label>
              <Input
                id="user_id"
                name="user_id"
                type="text"
                height="h-12"
                rules={{ required: "사용자ID를 입력하세요" }}
                // handleChange={onChangeId}
              />
              {errors?.user_id?.message && <ErrorMessage>{errors.user_id.message}</ErrorMessage>}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-12 mt-4">
              <Label id="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                height="h-12"
                rules={{
                  required: "비밀번호를 입력하세요",
                  minLength: {
                    value: 4,
                    message: "비밀번호는 4자리 이상의 문자열을 사용하세요",
                  },
                  maxLength: {
                    value: 8,
                    message: "Your password should have no more than 8 characters",
                  },
                }}
                // handleChange={onChangePassword}
              />
              {errors?.password?.message && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </InputWrapper>
          </div>
        </div>

        <div>
          {errMessage && <ErrorMessage>{errMessage}</ErrorMessage>}
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <input type="checkbox" />
            Remember me
          </div>
          <div>
            <a className="text-blue-500" href="https://pwm.kwe.co.kr">Forgot password?</a>
          </div>
        </div>
        <div className="flex justify-start space-x-2">
          <button
            type="submit"
            className="justify-center w-full h-12 px-3 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Sign In
          </button>
        </div>
        {/* <div className="flex flex-row items-center justify-center">
          <span>
            Don't have an account yet? <a className="text-blue-500"> Sign up</a>
          </span>
        </div> */}
      </form>
    </FormProvider>
  );
}

