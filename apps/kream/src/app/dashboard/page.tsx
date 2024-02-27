// 'use server'
'use client'

import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useStore } from "utils/zustand";
import { useUserSettings } from "states/useUserSettings";
import { useConfigs } from "states/useConfigs";

import { getUserData } from "@/app/login/_components/login"
import { auth, signOut } from '@/api/auth/auth';
import { FiSettings, FiMenu, FiUser, FiExternalLink } from "react-icons/fi";
import { useSession } from "next-auth/react";


export default function Home() {
  // const { data: session } = useSession();
  // const [ipAddress, setIPAddress] = useState('Web');
  // const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  // const configActions = useConfigs((state) => state.actions);
  // const [userData, setUserData] = useState({});

  // const session = await auth();
    // const {data:session} = useSession();

    // const id = session?.user.user_id;
    // const name = session?.user.user_nm;

    // console.log("Home", id, name);

  // const setUser = async () => {
  //   const id = await session?.user.email;
  //   const name = await session?.user.name;
  //   const userData = await getUserData({user_id: id, user_nm:name, ipaddr:ipAddress});

  //   // console.log("login-form:: res.user =====> ", id, name, JSON.stringify(session?.user));
  //   // console.log("userData[0]", JSON.stringify(userData[0]));
  //   // userSettingsActions?.setData({ ...userData[0] });

  //   // return userData[0];
  // }

  // useEffect(() => {
  //   // const user = setUser();
  //   // setUserData(user);
  //   // userSettingsActions?.setData({ ...userData });
  //   setUser();
  // }, []);

  
  
  return (
    <>
      시작
      {/* {session ? JSON.stringify(session) : "X"} */}
    </>
  );
}

