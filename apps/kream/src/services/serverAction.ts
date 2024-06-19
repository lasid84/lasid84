'use server'

import { cookies, headers } from 'next/headers'
import { auth, signOut } from '@/app/api/auth/auth';
import { redirect, RedirectType } from 'next/navigation';
import { decode } from "next-auth/jwt";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { signJwtAccessToken, verifyJwt } = require('@repo/kwe-lib/components/jsonWebToken');

 
export async function navigate(url: string) {
//   redirect(`/${data.get('id')}`)
    redirect(url);
}

export async function getSession() {
    return await auth();
}

export async function logOut() {
    // await signOut({ redirect: false });
    await signOut({redirectTo:"/login"});
    // await signOut();
    // redirect("/login");
}

export async function getCookies() {
    // log(cookies().getAll());
    const sessionToken = cookies().get('authjs.session-token')?.value;
    // const decoded = await decode({
    //     salt: 'authjs.session-token',
    //     token: sessionToken,
    //     secret: process.env.NEXTAUTH_SECRET!
    // });
    return cookies().get('authjs.session-token')?.value;
    
};

export async function getToken() {
    // log(cookies().getAll());
    const sessionToken = cookies().get('authjs.session-token')?.value;
    const decoded = await decode({
        salt: 'authjs.session-token',
        token: sessionToken,
        secret: process.env.NEXTAUTH_SECRET!
    });
    if (!decoded?.email) return null;

    const token = signJwtAccessToken({user_id:decoded?.email, user_nm:decoded?.name});
    return token;
};

export async function getHeaders() {
    return await headers();
}

// 안됨
// export const getIP = () => {
//     const header = headers()
//     var ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
//     log("ip", ip);
//     return ip;
// };

