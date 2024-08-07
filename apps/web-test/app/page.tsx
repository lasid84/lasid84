// import AcmeLogo from '@/app/ui/acme-logo';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import styles from '@/app/ui/home.module.css';
// import { lusitana } from '@/app/ui/fonts';
// import Image from 'next/image';

// export default function Page() {
//   return (
//     <main className="flex flex-col min-h-screen p-6">
//       <div className="flex items-end h-20 p-4 bg-blue-500 rounded-lg shrink-0 md:h-52">
//         <AcmeLogo />
//       </div>
//       <div className="flex flex-col gap-4 mt-4 grow md:flex-row">
//         <div className="flex flex-col justify-center gap-6 px-6 py-10 rounded-lg bg-gray-50 md:w-2/5 md:px-20">
//         <div className={styles.shape}></div>
//           <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
//             <strong>Welcome to Acme.</strong> This is the example for the{' '}
//             <a href="https://nextjs.org/learn/" className="text-blue-500">
//               Next.js Learn Course
//             </a>
//             , brought to you by Vercel.
//           </p>
//           <Link
//             href="/login"
//             className="flex items-center self-start gap-5 px-6 py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-400 md:text-base"
//           >
//             <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
//           </Link>
//         </div>
//         <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
//           <Image 
//                 src="/hero-desktop.png"
//                 width={1000}
//                 height={760}
//                 className="hidden md:block"
//                 alt="Screenshots of the dashboard project showing desktop version"
//             />
//             <Image 
//                 src="/hero-mobile.png"
//                 width={560}
//                 height={620}
//                 className="hidden md:hidden"
//                 alt="Screenshots of the dashboard project showing desktop version"
//             />
//         </div>
//       </div>
//     </main>
//   );
// }


'use client'
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

import Image from 'next/image'

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
const { log } = require('@repo/kwe-lib/components/logHelper');

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

  const { status, data: session }: SessionType = useSession();

  const isLogin = !!session && status === "authenticated";
  // const accesstoken = isLogin ? session.Authorization : "";
  // const refreshToken = isLogin ? session.RefreshToken : "";
  // log("0==============login page", isLogin, status, session);
  useEffect(() => {
    // setCookie("Authroization", accesstoken);
    // setCookie("RefreshToken", refreshToken);
    // log("==============login page", isLogin, status, session);
  }, [session]);

  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
}