'use client'
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import Image from 'next/image'

const { log } = require('@repo/kwe-lib/components/logHelper');
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import { FormProvider, useForm } from "react-hook-form";
import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";
import { useSession } from "next-auth/react"

export type FormProps = {
  user_id: string;
  password: string;
};

type Props = {
  children: React.ReactNode;
};

type SessionData = {
  Authorization: string;
  RefreshToken: string;
  expires: string;
};

type SessionType = {
  data: SessionData | any;
  status: string;
  update: any;
};
 
export default function LoginPage() {

  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
    const { data: session, update } = useSession();

  return (
    // <SessionProvider session={session}>
    // <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex items-end w-full h-20 p-3 rounded-lg bg-white-500 md:h-36">
            {/* <div className="w-32 text-white md:w-36"> */}
              <AcmeLogo />
            {/* </div> */}
          </div>
            <LoginForm />
        </div>
      </main>
      // </form>
    // </SessionProvider>
  );
}