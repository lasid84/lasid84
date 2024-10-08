"use client";
import { FormEvent, MouseEventHandler, Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { Input } from "components/react-hook-form/input";
import { useStore } from "utils/zustand";
import { useUserSettings } from "states/useUserSettings";
import clsx from "clsx";
import { Login } from "@/app/login/_components/login";
import { FaSpinner } from "react-icons/fa";
import { useConfigs } from "states/useConfigs";

const { log } = require('@repo/kwe-lib/components/logHelper');

export type FormProps = {
  user_id: string;
  password: string;
};

const initialState = {
  success: false,
  message: '',
  user_id: '',
  user_nm: ''
};

export default function LoginForm() {
  const [errMessage, setErrMessage] = useState('');
  const [isCircle, setIsCircle] = useState<boolean>(false)
  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  const configActions = useConfigs((state) => state.actions);
  const refPW = useRef();
  
  const router = useRouter();

  useEffect(() => {
    userSettingsActions?.reset();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const methods = useForm<FormProps>({
    // defaultValues: {
    //   user_id: "",
    //   password: "",
    // },
  });
  const {
    handleSubmit,
    reset,
    getValues,
    register,
    formState: { errors },
  } = methods;

  const login = async (data:any) => {
    var user = data;

    if (!user.user_id || !user.password) {
      setErrMessage('Please Input ID & Password');
      return;
    }

    setIsCircle(true)
    const res = await Login({ user_id: user.user_id.toLowerCase().replace('@kwe.com', ''), password: user.password });
    if (!res!.success) {
      setErrMessage(res?.message);
      setIsCircle(false)
      return;
    };
    setErrMessage('');

    userSettingsActions!.setData({ ...res?.data });
    configActions.setConfig({ 
      lang: res?.data.lang ? res?.data.lang : 'KOR'
    });
      
    router.replace('/dashboard');
  }

  const onSubmit = async (e:React.MouseEvent<HTMLElement>) => {
    try {
      e.preventDefault();
      var user = getValues();
      await login(user);
    } catch (err) {
      // log("login-form err", err);
      setErrMessage(JSON.stringify(err));
      return;
    } finally {
      // reset();
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (e.currentTarget.id) {
        case "user_id":
          // log("refPW.current", refPW.current)
          // if (refPW.current) refPW.current.focus();
          // if (e.key === "Enter") {
          //   const form = e.target.form;
          //   // log(e.target, form);
          //   const index = [...form].indexOf(e.target);
          //   // log(index)
          //   form[index + 1].focus();
          // }
          break;
        case "password":
          var user = getValues();
          // log("refPW.current", user);
          await login(user);
          break;
      }
    }
  }
  
  return (
    <FormProvider {...methods}>
      {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> */}
        {/* <form onSubmit={onSubmit} className="space-y-6"> */}
        <form className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="email" name="User ID"/>
              <Input
                // ref={refID}
                id="user_id"
                name="user_id"
                type="text"
                height="h-12"
                isCircle={isCircle}
                rules={{ required: "사용자ID를 입력하세요"}}
              // handleChange={onChangeId}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              {errors?.user_id?.message && <ErrorMessage>{errors.user_id.message}</ErrorMessage>}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-12 mt-4">
              <Label id="password" name="Password"/>
              <Input
                // ref={refPW}
                id="password"
                name="password"
                type="password"
                height="h-12"
                isCircle={isCircle}
                rules={{
                  required: "비밀번호를 입력하세요",
                  minLength: {
                    value: 4,
                    message: "비밀번호는 4자리 이상의 문자열을 사용하세요",
                  },
                  ref:refPW
                  // maxLength: {
                  //   value: 8,
                  //   message: "Your password should have no more than 8 characters",
                  // },
                }}
              // handleChange={onChangePassword}
              onKeyDown={(e) => handleKeyDown(e)}
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
          {/* <Suspense fallback={<FaSpinner className="justify-center w-full animate-spin" size={20} color="#f070f3" />}> */}
          <button
            // type="submit"  -> 이걸로할시 페이지 로딩중 버튼 클릭하면 url에 id&pw 정보 표시됨
            type="button"
            onClick={(e) => onSubmit(e)}
            className={clsx("justify-center w-full h-12 px-3 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2",
            isCircle && "hover:bg-gray-600 ring-gray-500  bg-gray-600 ring-2 ring-offset-2")}>
          {isCircle ?  <><FaSpinner className="justify-center w-full animate-spin" size={20} color="#f070f3" /></> : 'Sign In' }
          </button>
          {/* </Suspense> */}
        </div>
        {/* {clsx("animate-spin", isCircle &&"hidden", !isCircle && "")} */}
        {/* <div className="flex flex-row items-center justify-center">
          <span>
            Don't have an account yet? <a className="text-blue-500"> Sign up</a>
          </span>
        </div> */}
      </form>
    </FormProvider>
  );
}

