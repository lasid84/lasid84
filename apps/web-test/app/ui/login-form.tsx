'use client'

import {useEffect, useState, useMemo} from "react";
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";


const {log} = require('@repo/kwe-lib/components/logHelper');
const {sleep} = require('@repo/kwe-lib/components/sleep');

import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { json } from "stream/consumers";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  // const [formState, dispatch] = useFormState(authenticate, null);
  
//   const userSettingsActions = useStore(useUserSettings, (state) => state.actions);

//   useEffect(() => {
//     log("errorMessage", formState);
//     if (formState?.success) {
//       const userData = formState.data;
//       userSettingsActions!.setData({ user_id: userData.user_id });
//       userSettingsActions!.setData({ user_name: userData.user_nm });
//       userSettingsActions!.setData({ permission_id: userData.permission_id });
//       userSettingsActions!.setData({ user_grp_id: userData.user_grp_id });
//       userSettingsActions!.setData({ office_cd: userData.office_cd });
//       userSettingsActions!.setData({ dept_cd: userData.dept_cd });
//       userSettingsActions!.setData({ trans_mode: userData.trans_mode });
//       userSettingsActions!.setData({ trans_type: userData.trans_type });
  
// }
//   }, [formState]);

  

  // console.log("dispatch-----", FormData);
  return (
    // <form className="space-y-3">
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 px-6 pt-8 pb-4 rounded-lg bg-gray-50">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="block mt-5 mb-3 text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block mt-5 mb-3 text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        {/* Add form errors here */}
        <div
          className="flex items-end h-8 space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {errorMessage && ( */}
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              {/* <p className="text-sm text-red-500">{errorMessage}</p>*/}
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        
        <div className="flex flex-row justify-between space-x-2 grow md:flex-col md:space-x-0 md:space-y-2">
        <div className="hidden w-full h-auto rounded-md grow bg-gray-50 md:block"></div>
      </div>


      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    // <Button className="w-full mt-4">
    //   Log in <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-50" />
    // </Button>
    <Button className="w-full mt-4" aria-disabled={pending}>
      Log in <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-50" />
    </Button>
  );
}

