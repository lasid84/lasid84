'use server'

import { cookies } from 'next/headers'
import { auth, signOut } from '@/app/api/auth/auth';
import { redirect } from 'next/navigation';
import { decode } from "next-auth/jwt";
const { log } = require('@repo/kwe-lib/components/logHelper');
import { signJwtAccessToken, verifyJwt } from '@repo/kwe-lib/components/jsonWebToken';

 
export async function navigate(url: string) {
//   redirect(`/${data.get('id')}`)
    redirect(url);
}

export async function getSession() {
    return await auth();
}

export async function logOut() {
    // signOut({ callbackUrl: "/login" });
    await signOut();
    redirect("/login");
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
    const token = signJwtAccessToken({user_id:decoded!.email, user_nm:decoded!.name});
    return token;
};

