// import NextAuth from 'next-auth';
// import { authConfig } from '@/app/api/auth/auth.config';
// const { log } = require('@repo/kwe-lib/components/logHelper');
 
// export default NextAuth(authConfig).auth;
 
// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// log("middleWare");

import type { NextRequest } from 'next/server'

const { log } = require('@repo/kwe-lib/components/logHelper');
 
export function middleware(request: NextRequest) {
  // log("middleware", request);
  // const currentUser = request.cookies.get('currentUser')?.value
 
  // if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return Response.redirect(new URL('/dashboard', request.url))
  // }
 
  // if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
  //   return Response.redirect(new URL('/login', request.url))
  // }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}