'use client'

import LoginForm from "@/app/login/_components/login-form";
import AuthSession from "@/components/provider/AuthProvider";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { log } from '@repo/kwe-lib/components/logHelper';

export default function Login() {

  const router = useRouter();
  const [isReady, setReady] = useState(false);
  
  var session;
  useEffect(() => {
    const sessionCheck = async () => {
      session = await getSession();
      log("layout page useEffect", session);
      if (session) router.replace('/dashboard');
      setReady(true);
    };
    
    sessionCheck();
  }, []);

  if (!isReady) return <></>

  return (
    <>
      <div className="w-full xl:grid xl:grid-cols-3">
        <div className="hidden w-full col-span-2 xl:flex">
          <div className="relative flex flex-col justify-between h-screen p-8 text-white">
            <div className="flex flex-row justify-between px-8 py-6">
              <div>
                <img className={"expanded"} src={`/logos/kwe_logo_bright-removebg.png`} alt={"KWE LOGO"} />
              </div>
              <div>
                <select className="text-white bg-transparent hover:bg-transparent">
                  <option className="text-black">Language</option>
                  <option className="text-black">Korean</option>
                  <option className="text-black">English</option>
                  <option className="text-black">Japanese</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col p-8">
              <p className="mb-4 text-2xl font-bold">Welcome KREAM</p>
              <p className="text-sm font-thin">
              KWE Resource Efficient Automation for Management
              </p>
            </div>
            <div className="z-10 flex flex-row items-center justify-between w-full p-8 text-xs">
              <div className="text-white">KREAM WEB</div>
              <div className="flex flex-row ml-auto space-x-2">
                {/* <div>Contact us</div> */} 
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full h-screen bg-white place-content-center place-items-center">
          <div className="w-full xl:w-[460px] h-screen xl:h-[600px]">
            <div className="flex flex-row justify-between px-8 py-6 border-b border-gray-100 xl:hidden">
              <div>
                <img className={"expanded"} src={`/logos/kwe_logo_bright-removebg.png`} alt={""} />
              </div>
            </div>
            <div className="flex flex-col justify-center px-4 py-6 space-y-2">
              <span className="mt-4 ml-4 text-2xl font-extrabold">Welcome</span>
              <span className="ml-4 text-sm">Please enter ID/PW at the bottom</span>
            </div>
            <div className="p-8">
              {/* <AuthSession> */}
              <LoginForm />
              {/* </AuthSession> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
