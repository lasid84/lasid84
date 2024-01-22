'use client'

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

import { useSession } from "next-auth/react"
import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";
import { Component, Fragment, useEffect } from "react";

export default function SideNav() {

  const { data: session, update } = useSession();
  // const userStoreData = useStore(useUserSettings, (state) => state.data);
  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);

  const userData = session?.user;
  // userSettingsActions!.setData(userData);

  // useEffect(() => {
  //   setUser(userData);
  //   console.log("LeftSidebar start", userData);
  //   console.log("LeftSidebar start session", session);
    
  // }, [userData]);

  // const setUser = (user) => {
  //   console.log("setUser", user.user_id);
  //   userSettingsActions!.setData(user);
  //     //  userSettingsActions!.setData({ user_name: userData.user_nm });
  //   //    userSettingsActions!.setData({ permission_id: userData.permission_id });
  //   //    userSettingsActions!.setData({ user_grp_id: userData.user_grp_id });
  //   //    userSettingsActions!.setData({ office_cd: userData[0].office_cd });
  //   //    userSettingsActions!.setData({ dept_cd: userData[0].dept_cd });
  //   //    userSettingsActions!.setData({ trans_mode: userData[0].trans_mode });
  //   //    userSettingsActions!.setData({ trans_type: userData[0].trans_type });

  //   //    //ip 추가
  //   //    userSettingsActions!.setData({ ufs_id: userData[0].ufs_id });
  // }
  
  // console.log(se)
  return (
    <div className="flex flex-col h-full px-3 py-4 md:px-2">
      <Link
        className="flex items-end justify-start p-4 mb-2 rounded-md h-30 bg-white-600 md:h-30"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>      
      <div className="flex flex-row justify-between space-x-2 grow md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden w-full h-auto rounded-md grow bg-gray-50 md:block"></div>
        <form
            action={async () => {
              // 'use server';
              // await signOut();
            }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
