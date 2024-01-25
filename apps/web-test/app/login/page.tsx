'use client'
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import Image from 'next/image'
import {useUserSettings} from '@/app/states/useUserSettings'

const { log } = require('@repo/kwe-lib/components/logHelper');


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

  const userInfo = useUserSettings.getState().data; 

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
          {userInfo.user_id}
            <LoginForm />
        </div>
      </main>
      // </form>
    // </SessionProvider>
  );
}