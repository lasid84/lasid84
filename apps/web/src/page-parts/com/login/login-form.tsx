import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { Input } from "components/react-hook-form/input";
import { useRouter } from "next/router";
import { loginUser } from "page-parts/com/login/login.query";
// import { devConsoleLog } from "utils/dev";
import { toastError } from "tmpl/toast";

import { useConfigs } from "states/useConfigs";
import { useUserSettings } from "states/useUserSettings";

import { useStore } from "utils/zustand";
import React, { useState } from 'react';
import {executFunction} from "@repo/kwe-lib/components/api.service";
import { log } from '@repo/kwe-lib/components/logHelper';
import { signIn } from 'next-auth/react';


export type FormProps = {
  user_id: string;
  password: string;
};

const Index: React.FC = () => {
  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  const configActions = useConfigs((state) => state.actions);

  const [token, setToken] = useState('');
  //const [userData, setUserData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

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

  const getUserData = (async (data:any) => {
    try {
        log("start getUserData", data)
        const inparam = ["in_user_id", "in_user_nm", "in_ipaddr"];
        const invalue = [data.user_id, data.user_nm, data.ipaddr];
        const inproc = 'public.f_admn_get_userauth'; 
        const cursorData = await executFunction(inproc,inparam, invalue);    
        log("cursorData", cursorData[0]);
        if (cursorData !== null) {   
            return cursorData[0];
        }       
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    };
  });

  const onSubmit = async (user: FormProps) => {
    console.log('on submit user',user)
    try {
      // log("onSubmit Login : ", user)
      // const res = await loginUser(user);
      // const {data} = await res;
      // // log("onSubmit data", data)
      // setToken(data.token);

      const data = await signIn("credentials", {
        user_id: user.user_id,
        password: user.password,
        redirect: false,
        //callbackUrl: "/",
      });
          

      // TODO:: JwtToken 값 localStorage보관

      // 로그인 OK,
      // 사용자 설정값, 기본 코드값 캐싱 처리
      // const currUser = res.user;
      log("here!");
      const userData = await getUserData({user_id: user.user_id, user_nm:data.user_nm, ipaddr:'1.1.1.1'})

       console.log("login-form:: res.user =====> ", JSON.stringify(user.user_id), data.user_nm);
       userSettingsActions!.setData({ user_id: userData[0].user_id });
       userSettingsActions!.setData({ user_name: userData[0].user_nm });
       userSettingsActions!.setData({ permission_id: userData[0].permission_id });
       userSettingsActions!.setData({ user_grp_id: userData[0].user_grp_id });
       userSettingsActions!.setData({ office_cd: userData[0].office_cd });
       userSettingsActions!.setData({ dept_cd: userData[0].dept_cd });
       userSettingsActions!.setData({ trans_mode: userData[0].trans_mode });
       userSettingsActions!.setData({ trans_type: userData[0].trans_type });

       //ip 추가
       userSettingsActions!.setData({ ufs_id: userData[0].ufs_id });
      // 정상적인 로직처리
      
      router.push("/");
    } 
    catch (error) {
      console.log("error api service", error);
      // if (axios.isAxiosError(error)) {
      //   // user_id, password not found!
      //   if (error.response?.status === 404) {
      //     toastError(error.response.data.message);
      //   }
      // } else {
      //   console.log(error);
      // }
      // return;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              />
              {errors?.password?.message && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </InputWrapper>
          </div>
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
};
export default Index;
